import express from "express";
import { auth } from "../middleware/auth.js";
import { addText, generateArticles, generateBlogTitles, generateImage, removeImageBackground, removeImageObject, resumeReview } from "../controller/aiController.js";
import upload from "../config/multer.js";
import { requirePremium } from "../middleware/requirePremium.js";
import { attachPlan } from "../middleware/attachPlan.js";


const aiRouter = express.Router();

aiRouter.post('/generate-article',auth,attachPlan,generateArticles)
aiRouter.post('/generate-blog-title',auth,attachPlan,generateBlogTitles)
aiRouter.post('/generate-image',auth,requirePremium,generateImage)
aiRouter.post('/remove-image-background',auth,requirePremium,upload.single('image'),removeImageBackground)
aiRouter.post('/remove-image-object',auth,requirePremium,upload.single('image'),removeImageObject)
aiRouter.post('/resume-review',auth,requirePremium,upload.single('resume'),resumeReview)
aiRouter.post('/text-overlay',auth,requirePremium,upload.single('image'),addText)

export default aiRouter