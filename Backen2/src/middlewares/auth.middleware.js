import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){ 
            return res.status(401).json({
                success:false,
                message:"Unauthorized user"
            })
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({
                success:false,
                message:"Unauthorized user"
            })
            console.log(decoded)
        }
        const user=await User.findById(decoded.userId);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Unauthorized user"
            })
        }
        req.user=user;
        next()
    }catch(error){
        console.log("error in auth middleware",error.message);
        return res.status(401).json({
            success:false,
            message:"Unauthorized user"
        })
    }
}
