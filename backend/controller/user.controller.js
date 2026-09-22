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
export async function updateUserProfileController(req, res) {
  try {
    const { email, name, handle, customAvatar, bio, targetGoal } = req.body;

    // Construct an update object with only defined fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (handle !== undefined) updateData.handle = handle;
    if (customAvatar !== undefined) updateData.customAvatar = customAvatar;
    if (bio !== undefined) updateData.bio = bio;
    if (targetGoal !== undefined) updateData.targetGoal = targetGoal;

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}