// import OpenAI from "openai";
// import sql from "../config/db.js";
// import { clerkClient } from "@clerk/express";

// const AI = new OpenAI({
//     apiKey: "process.env.GEMINI_API_KEY",
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });

// export const generateArticles = async(req,res)=>{
// try {
//     const {userId} = req.auth()
//     const {length ,prompt} = req.body
//     const plan =req.plan;
//     const free_usage  = req.free_usage;
    
//     if(plan !== 'premium' && free_usage>=10){
//         return res.json({success:false , message:'Limit  reached. Upgrade to continue.'})
//     }

//     const content = response.choices[0].message.content

//     await sql `IMPORT INTO Creations (userId,prompt,content,type)
//     VALUES(${userId},${prompt},${content},'article')`

//  if(plan !== 'premium'){
//          await clerkClient.users.updateUserMetadata(userId,{
//             privateMetadata:{free_usage: free_usage+1}
//          }
//          )
//     }
//     res.json({success:true,content})

// } catch (error) {
//     res.json({success:false,error:error.message})
// }
// }


// const response = await AI.chat.completions.create({
//     model: "gemini-2.5-flash",
//     messages: [
//         {
//             role: "user",
//             content: prompt,
//         },
//     ],
//     temperature: 0.7,
//     max_tokens: length,
// });

// console.log(response.choices[0].message);
import OpenAI from "openai";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, 
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticles = async (req, res) => {
  try {
    const { userId } = req.auth();
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

    
    const response = await AI.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    
    await sql`
      INSERT INTO creations (userid, prompt, content, type)
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
    console.error(error);
    res.json({ success: false, error: error.message });
  }
};
