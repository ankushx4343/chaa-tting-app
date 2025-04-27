import express from 'express';
import authRoutes from './routes/auth.route.js';
import cookieparser from 'cookie-parser'
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import messageRouter from './routes/message.route.js';
import cors from 'cors'
dotenv.config()
const port=process.env.PORT
import {app,server} from"./socket.js"


app.use(cors({
    origin:"https://chaa-tting-app.onrender.com",
    credentials:true
}))
app.use(cookieparser())
app.use(express.json({ limit: '10mb' }));

connectDB();

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRouter)




server.listen(5001,()=>{
    console.log(`server started on port ${port}`)
})
