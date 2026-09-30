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
    const { email, name, handle, customAvatar, bio, targetGoal } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (handle !== undefined) updateData.handle = handle;
    if (bio !== undefined) updateData.bio = bio;
    if (targetGoal !== undefined) updateData.targetGoal = targetGoal;

    // Case 1: File Uploaded from local device
    if (req.file) {
      updateData.customAvatar = {
        url: "",
        fileData: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } 
    // Case 2: URL Link Provided or string cleared
    else if (customAvatar !== undefined) {
      if (typeof customAvatar === "string" && customAvatar.trim() !== "") {
        updateData.customAvatar = {
          url: customAvatar.trim(),
          fileData: undefined,
          contentType: undefined,
        };
      } else {
        // Reset/clear avatar
        updateData.customAvatar = { url: "", fileData: undefined, contentType: undefined };
      }
    }

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