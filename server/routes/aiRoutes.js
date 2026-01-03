import express from "express";
import { auth } from "../middleware/auth.js";
import { generateArticles, generateBlogTitles, generateImage, removeImageBackground, removeImageObject, resumeReview } from "../controller/aiController.js";
import { upload } from "../config/multer.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article',auth,generateArticles)
aiRouter.post('/generate-blog-title',auth,generateBlogTitles)
aiRouter.post('/generate-image',auth,generateImage)
aiRouter.post('/remove-image-background',upload.single('image'),auth,removeImageBackground)
aiRouter.post('/remove-image-object',upload.single('image'),auth,removeImageObject)
aiRouter.post('/resume-review',upload.single('resume'),auth,resumeReview)

export default aiRouter