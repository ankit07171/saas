import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express'
dotenv.config()

const app = express()
app.use(express())
app.use(clerkMiddleware(), requireAuth())
app.use(express.json())

app.get('/',(req,res)=>res.send('Server is Live'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{ console.log('Running on port',PORT);}
)