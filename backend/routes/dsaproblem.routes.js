import { Router } from "express";
import { getProblemquestion } from "../controller/problems.controller.js";
import { verifyToken } from "../util/token.js";

const dsaproblemroute = Router();

dsaproblemroute.get('/prob',getProblemquestion );
export default dsaproblemroute;