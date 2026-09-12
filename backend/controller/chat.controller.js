import User from '../model/user.js';
import { ai, DEFAULT_MODEL } from '../config/mygoogle.js';



export const generateChatCompletion = async (req, res, next)=>{
    const { message } = req.body;
    
const user = await User.findById(res.locals.jwtData.id);

if (!user) {
  return res.status(401).json({
    message: "User not found",
  });
}

user.chats.push({
  role: "user",
  content: message,
});


const response = await ai.models.generateContent({
  model: DEFAULT_MODEL,
  contents: message,
});

user.chats.push({
  role: "assistant",
  content: response.text ?? "",
});

await user.save();

return res.status(200).json({
  chats: user.chats,
});
    
};

export const sendChattoUser = async(req,res,next)=>{
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
  return res.status(401).send("User not registered OR Token malfunctioned");
}
  if (user._id.toString === res.locals.jwtData.id) {
    return res.status(401).send("Permissions didn't match");
  }
  return res.status(200).json({
    message: "Ok",
    chats: user.chats
  })
  } catch (error) {
    return res.json({message: "Error", error: error.message});
  }
}

export const deleteChats = async(req,res,next)=>{
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
  return res.status(401).send("User not registered OR Token malfunctioned");
}
  if (user._id.toString === res.locals.jwtData.id) {
    return res.status(401).send("Permissions didn't match");
  }
  user.chats = [];
  await user.save();
  return res.status(200).json({
    message: "Ok"
  })
  } catch (error) {
    return res.json({message: "Error", error: error.message});
  }
}