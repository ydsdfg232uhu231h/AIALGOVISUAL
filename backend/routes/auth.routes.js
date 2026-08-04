import { Router } from "express";
import { handleLogin, handleSignup, handleuserdetail } from "../controller/auth.controller.js";
import { loginvalidator, signupvalidator, validate } from "../util/validation.js";
import { verifyToken } from "../util/token.js";
import { verifyuser } from "../controller/user.controller.js";

const authRouter = Router();

authRouter.post("/login",validate(loginvalidator),handleLogin);
authRouter.post('/signup',validate(signupvalidator), handleSignup);
authRouter.get("/me", handleuserdetail);
authRouter.get("/auth-status", verifyToken, verifyuser);
export default authRouter;