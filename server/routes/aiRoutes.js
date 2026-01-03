import express from "express";
import { auth } from "../middleware/auth.js";
import { generateArticles, generateBlogTitles, generateImage, removeImageBackground, removeImageObject, resumeReview } from "../controller/aiController.js";
import { upload } from "../config/multer.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article',auth,generateArticles)
aiRouter.post('/generate-blog-title',auth,generateBlogTitles)
aiRouter.post('/generate-image',auth,generateImage)
aiRouter.post('/remove-image-background',auth,upload.single('image'),removeImageBackground)
aiRouter.post('/remove-image-object',auth,upload.single('image'),removeImageObject)
aiRouter.post('/resume-review',auth,upload.single('resume'),resumeReview)

export default aiRouter