import { Router } from "express";
import { getProblemanswer, getProblemquestion } from "../controller/problems.controller.js";


const dsaproblemroute = Router();

dsaproblemroute.get('/prob',getProblemquestion );
dsaproblemroute.get("/ans", getProblemanswer);
export default dsaproblemroute;