import {Router} from "express";
import {  handleUpload } from "../middleware/upload.js";
import { updateUserProfileController, userswelcome } from "../controller/user.controller.js";

const userRoutes = Router();

userRoutes.get("/", userswelcome)
userRoutes.put("/profile",handleUpload , updateUserProfileController);
export default userRoutes;