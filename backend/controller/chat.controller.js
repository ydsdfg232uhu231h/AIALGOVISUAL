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
console.log("Model",DEFAULT_MODEL);
console.log("message", message)

const response = await ai.models.generateContent({
  model: DEFAULT_MODEL,
  contents: "Hello how are you",
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