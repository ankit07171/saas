import express from "express";
import { auth } from "../middleware/auth.js";
import { generateArticles } from "../controller/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article',auth,generateArticles)

export default aiRouter