import { hash, compare } from "bcrypt";
import User from "../model/user.js";
import { COOKIES_NAME } from "../util/content.js";
import { createToken } from "../util/token.js";
import { notifyUser } from "./notification.controller.js";

// Cookie configuration options
const cookieOptions = {
  httpOnly: true,
  signed: true,
  sameSite: "lax",
  path: "/",
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not registered",
      });
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(403).json({
        message: "Incorrect password",
      });
    }

    const token = createToken(user._id.toString(), user.email, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // Clear old session & set new cookie
    res.clearCookie(COOKIES_NAME, cookieOptions);
    res.cookie(COOKIES_NAME, token, { ...cookieOptions, expires });

    // Send Security Alert Email
    try {
      await notifyUser({
        userEmail: user.email,
        userName: user.name,
        subject: "Security Alert: New Login to AAFPS",
        text: `Hello ${user.name},\n\nWe detected a new sign-in to your AAFPS account.\n\nIf this was you, no action is needed. If you did not log in, please reset your password immediately.`,
      });
    } catch (err) {
      // Prevent email delivery issues from blocking successful user login
      console.error("[Login Email Error]:", err.message);
    }

    return res.status(200).json({
      message: "Login Successful",
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const handleSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id.toString(), user.email, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIES_NAME, token, { ...cookieOptions, expires });

    // Send Welcome Email
    try {
      await notifyUser({
        userEmail: user.email,
        userName: user.name,
        subject: "Welcome to AAFPS!",
        text: `Hello ${user.name},\n\nWelcome to AAFPS! We're excited to have you on board.`,
      });
    } catch (err) {
      console.error("[Signup Email Error]:", err.message);
    }

    return res.status(201).json({
      message: "Signup successful",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export async function handleLogout(req, res) {
  try {
    const { email } = req.body;

    // Clear the auth cookie regardless of whether email was supplied
    res.clearCookie(COOKIES_NAME, cookieOptions);

    if (email) {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
    }

    return res.status(200).json({
      message: "User successfully logged out",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}