import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getusersforSidebar, sendMessage } from "../controller/message.controller.js";

const messageRouter=Router();

messageRouter.get("/users",protectRoute,getusersforSidebar);
messageRouter.get("/:id",protectRoute,getMessages);
messageRouter.post("/send/:id",protectRoute,sendMessage);

export default messageRouter