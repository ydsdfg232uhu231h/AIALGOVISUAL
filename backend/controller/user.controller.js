import User from "../model/user.js"; 
export function userswelcome(req,res){
    res.end("Welcome user");
}
export const verifyuser = async(req, res, next) => {
    try {
    // user Login
   
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
        return res.status(401).send("User not registered or Tokem mailfunctioned");

    }
    if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
    }
    
        return res.status(200).json({
            message: "Ok",
             name: user.name, email: user.email
            }
        );
        
    } catch (error) {
        return res.status(200).json({
            message: "Error",
             cause: error.message
            }
        );
    }
}