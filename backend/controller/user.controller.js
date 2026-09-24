import User from "../model/user.js";
export function userswelcome(req, res) {
    return res.status(200).send("Welcome user");
}
export const verifyuser = async (req, res, next) => {
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
            id: user._id,
            name: user.name,
            email: user.email,
            handle: user.handle,
            customAvatar: user.customAvatar || "", // <--- Ensure this is sent!
            bio: user.bio,
            targetGoal: user.targetGoal,
        }
        );

    } catch (error) {
        return res.status(401).json({
            message: "Error",
            cause: error.message
        });
    }
}




export async function updateUserProfileController(req, res) {
  try {
    const { email, name, handle, bio, targetGoal, customAvatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (handle !== undefined) updateData.handle = handle.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (targetGoal !== undefined) updateData.targetGoal = targetGoal;

    // Handle file from Multer (convert memory buffer to base64 Data URI)
    if (req.file) {
      const base64Str = req.file.buffer.toString("base64");
      updateData.customAvatar = `data:${req.file.mimetype};base64,${base64Str}`;
    } else if (customAvatar !== undefined) {
      updateData.customAvatar = customAvatar.trim();
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error updating profile"
    });
  }
}


