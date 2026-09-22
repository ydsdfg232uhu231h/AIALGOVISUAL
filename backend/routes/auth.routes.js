import { Router } from "express";
import { handleLogin, handleLogout, handleSignup } from "../controller/auth.controller.js";
import { loginvalidator, signupvalidator, validate } from "../util/validation.js";
import { verifyToken } from "../util/token.js";
import { updateUserProfileController, verifyuser } from "../controller/user.controller.js";
import { upload } from "../middleware/upload.js";

const authRouter = Router();

authRouter.post("/login",validate(loginvalidator),handleLogin);
authRouter.post('/signup',validate(signupvalidator), handleSignup);
authRouter.post("/logout", handleLogout);
authRouter.get("/auth-status", verifyToken, verifyuser);
authRouter.put("/profile",upload.single("customAvatar"), updateUserProfileController)
export default authRouter;