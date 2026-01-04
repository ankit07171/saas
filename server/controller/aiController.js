import { GoogleGenAI } from "@google/genai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import {v2 as cloudinary} from 'cloudinary';
import axios from "axios";
import FormData from "form-data";
import fs from 'fs';
// import pdf from 'pdf-parse/lib/pdf-parse.js';
import pdfParse from "pdf-parse";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const { PDFParse } = require("pdf-parse");
// const pdfParse = require("pdf-parse");
// const pdfParse = pdfModule?.PDFParse ;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateArticles = async (req, res) => {
  try {
    const authData = await req.auth();
    const userId = authData.userId;

    const { length, prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!prompt || !length) {
      return res.json({ success: false, message: "Prompt and length required" });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const content = response.text;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const generateBlogTitles = async (req, res) => {
  try {
    const authData = await req.auth();
    const userId = authData.userId;

    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!prompt) {
      return res.json({ success: false, message: "Prompt and length required" });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const content = response.text;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const generateImage = async (req, res) => {
  try {
    const authData = await req.auth();
    const userId = authData.userId;

    const { prompt, publish } = req.body;
    const plan = req.plan;
     
    if (!prompt) {
      return res.json({ success: false, message: "Prompt and length required" });
    }

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "This feaature is available only for premium subsciptions.",
      });
    }

    // const response = await ai.models.generateContent({
    //   model: "gemini-2.5-flash",
    //   contents: prompt,
    // });

    // const content = response.text;
    const formData = new FormData()
formData.append('prompt', prompt)

 const {data} = await  axios.post('https://clipdrop-api.co/text-to-image/v1',formData, {
  method: 'POST',
  headers: {'x-api-key': process.env.CLIPDROP_API_KEY,},
  responseType: "arraybuffer" })

// const base64Image = `data:image/png;base64,${Buffer.from(data,'binary').toString('base64')}`
const base64Image = `data:image/png;base64,${Buffer.from(data).toString("base64")}`;
const {secure_url} = await cloudinary.uploader.upload(base64Image)

    
await sql`
      INSERT INTO creations (user_id, prompt, content, type,publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image',${publish?? false})
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content:secure_url });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const removeImageBackground = async (req, res) => {
  try {
    const authData = await req.auth();
    const userId = authData.userId;

    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "This feaature is available only for premium subsciptions.",
      });
    }

    const {secure_url} = await cloudinary.uploader.upload(image.path,{
        transformation:[{
            effect: 'background_removal',
            background_removal: 'remove_the_background'
        }]
    })
    
await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId},'Removed background from Image', ${secure_url}, 'image')`;

    res.json({ success: true, content:secure_url });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const removeImageObject = async (req, res) => {
  try {
    const authData = await req.auth();
    const userId = authData.userId;

    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;
   
    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "This feaature is available only for premium subsciptions.",
      });
    }

 const {public_id} = await cloudinary.uploader.upload(image.path)
 const imageUrl = cloudinary.url(public_id,{
    transformation:[{effect: `gen_remove:${object}`}],
    resource_type:'image'
 })

await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content:imageUrl });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const resumeReview = async (req, res) => {
  try {
    const authData = await req.auth();
    const userId = authData.userId;

    const resume = req.file;
    const plan = req.plan; 
    // console.log(pdfModule);
    
    // console.log(typeof pdfParse); // should print: "function"

    if (plan !== "premium" ) {
      return res.json({
        success: false,
        message: "This feaature is available only for premium subsciptions.",
      });
    }
    if(resume.size > 5*1024*1024){
        return res.json({success:false, message:"Resume file size exceeds allowed size (5MB)."})
    }

    const dataBuffer = fs.readFileSync(resume.path)
    const  pdfData = await pdfParse(dataBuffer)
    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses and areas for improvement. Resume Content :\n\n ${pdfData.text}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const content = response.text;
      
await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume', ${content},'resume-review')
    `;

    res.json({ success: true, content});

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
