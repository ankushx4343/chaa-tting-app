import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const connectDB=async ()=>{
    try {
        console.log(process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error.message);
        
    }
}

export default connectDB