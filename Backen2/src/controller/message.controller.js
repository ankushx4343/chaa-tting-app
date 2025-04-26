import cloudnary from "../lib/cloudnary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getSocketId } from "../socket.js";
import { io } from "../socket.js";
export const getusersforSidebar=async(req,res)=>{
    try {
        const loggeduser=req.user._id;
        const  filtereduser=await User.find({_id:{$ne:loggeduser}}).select("-password")
        res.status(200).json({users:filtereduser});
    } catch (error) {
        console.log("error in getusersforSidebar",error.message);
        res.status(500).json({
            success:false,
            msg:"error in getusersforSidebar",
            error:error
        })
    }
}

export const getMessages=async(req,res)=>{
    try{
      const {id:userToChatId}=req.params;
      const myId=req.user._id.toString();
      const messages=await Message.find({
        $or:[
            {senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
      })
      console.log("skjdfhlkas",messages)
      res.status(200).json(messages)
    }catch(error){
     console.log("error in getMessageController",error.message);
     res.status(500).json({
        success:false,
        error:error
     })
    }
}

export const sendMessage=async(req,res)=>{
    try {

        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id.toString();
        console.log(req.user._id.toString())
        let imageUrl;
        if(image){
            const uploadResponse=await cloudnary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;  
        }

        const newMassage=new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            img:imageUrl

        })
        await newMassage.save();
        //todo:add realtime functionality 

        const receiverssocketId=getSocketId(receiverId);
        if(receiverssocketId){
            io.to(receiverssocketId).emit("newMessage",newMassage)
        }
        res.status(201).json(newMassage)
        
    } catch (error) {
        console.log("error in message controller",error);
        res.status(500).json({
            success:false,
            msg:"internal server error",
            error:error
        })
    }
}