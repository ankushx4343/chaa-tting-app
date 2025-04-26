import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { generateToken } from "../lib/util.js"
import cloudnary from "../lib/cloudnary.js"
dotenv.config()

export const signUPcontroller = async (req, res) => {
    try {
        const { email, fullname, password, profilepic } = req.body
        if (!email || !fullname || !password) {
            return res.status(400).json({
                success:false, 
                message: "All fields are required"
             })   
        }
        if (!email.includes("@")) {
            return res.status(400).json({ 
                success:false,
                message: "Email is not valid"
             })
        }
        if (password.length < 6) {
            return res.status(400).json({
                success:false,
                message: "Password must be at least 6 characters" })
        }
        const finduser = await User.findOne({ email })
        if (finduser) {
            return res.status(400).json({
                success:false,
                message: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10)
       const  hashed_password = await bcrypt.hash(password, salt)
        const user = await User.create({
            email,
            fullname,
            password: hashed_password,
            profilepic
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not created"
            })
        }

        const token = generateToken(user._id,res);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user
        })


    } catch (error) {
console.log("error in signup controller",error.message);
res.status(500).json({
    success:false,
    message:"Internal server error",
    error:error.message
})
    }
}

export const signIncontroller = async(req, res) => {
   try {
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    if(!email.includes("@")){
        return res.status(400).json({
            success:false,
            message:"Email is not valid"
        })
    }
     const user=await User.findOne({email});
     if(!user){
        return res.status(400).json({
            success:false,
            message:"User not found"
        })
     }
     
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        const token=generateToken(user.id,res);
        res.status(200).json({
          success:true,
          message:"User signed in successfully",
          token,
          user
        })
   } catch (error) {
    console.log("error in signin controller",error.message);
    res.status(500).json({
        success:false,
        message:"Internal server error",
        error:error.message
    })
    
   }
}

export const signOUTcontroller = (req, res) => {
   try {
     res.cookie("token","",{
        maxAge:0,
     })
     res.status(200).json({
        success:true,
        message:"User signed out successfully"
     })
   } catch (error) {
    console.log("error in signout controller",error.message);
    res.status(500).json({
        success:false,
        message:"Internal server error",
        error:error.message
    })  
 }
}

export const updateprofile=async(req,res)=>{
    try {
        const {profilepic}=req.body;
        const userId=req.user._id;
        if(!profilepic){
            return res.status(401).json({
                success:false,
                message:"profile pic is required"
            })
        }
        console.log(profilepic)
        const response=await cloudnary.uploader.upload(profilepic, {
            folder: "profile_pics",
          });
        const updateduser=await User.findByIdAndUpdate(
             userId,
            {profilepic:response.secure_url},
            {new:true})

            res.status(200).json({
                success:true,
                user:updateduser
            })
    } catch (error) {
        console.log("error in update profile",error);
        res.status(500).json({
            success:false,
            message:"internal server error "
        })
    }
}

export const checkAuth=async(req,res)=>{
    try {
        res.status(200).json({
            success:true,
            message:"authenticated",
            user:req.user
        })
    } catch (error) {
        console.log("error in checkAuthcontroller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}