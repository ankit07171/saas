import express from "express";
import { auth } from "../middleware/auth.js";
import { generateArticles, generateBlogTitles, generateImage } from "../controller/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article',auth,generateArticles)
aiRouter.post('/generate-blog-title',auth,generateBlogTitles)
aiRouter.post('/generate-image',auth,generateImage)

export default aiRouter