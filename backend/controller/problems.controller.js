import quesdata from "../data/ques.json" with {type: "json"};
export function getProblemquestion(req,res){
    return res.status(200).json({success: true, data: quesdata});
}