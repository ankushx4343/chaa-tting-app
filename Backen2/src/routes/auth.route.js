import { Router } from "express";
import { checkAuth, signIncontroller, signOUTcontroller, signUPcontroller, updateprofile } from "../controller/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const authRoutes=Router();

authRoutes.post("/signup",signUPcontroller)
authRoutes.post("/signin",signIncontroller)
authRoutes.post("/signout",signOUTcontroller)
authRoutes.put("/update-profile",protectRoute,updateprofile)
authRoutes.get("/check",protectRoute,checkAuth)
export default authRoutes;