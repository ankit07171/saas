import express from 'express';
import { auth } from '../middleware/auth';
import { getPublishedCreations, getUserCreations, toggleLikeCreations } from '../controller/userConroller';


const userRouter = express.Router();
userRouter.get('/get-user-creations', auth, getUserCreations)
userRouter.get('/get-published-creations', auth,
getPublishedCreations)
userRouter.post('/toggle-like-creation', auth, toggleLikeCreations)

export default userRouter;