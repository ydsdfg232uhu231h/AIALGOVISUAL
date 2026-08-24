import quesdata from "../data/ques.json" with {type: "json"};
import ansdata from "../data/ans.json" with {type: "json"};
export function getProblemquestion(req,res){
    return res.status(200).json({success: true, data: quesdata});
}
export function getProblemanswer(req, res){
    return  res.status(200).json({success: true, data: ansdata});
}