import {hash, compare} from "bcrypt";
import User from "../model/user.js";
import { COOKIES_NAME } from "../util/content.js";
import { createToken } from "../util/token.js";

export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        

        if (!user) {
            return res.status(401).json({
                message: "User not registered"
            });
        }
        

        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "Incorrect password"
            });
        }

        const token = createToken(
            user._id.toString(),
            user.email,
            "7d"
        );

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        

        res.clearCookie(COOKIES_NAME);

        res.cookie(COOKIES_NAME, token, {
            httpOnly: true,
            signed: true,
            expires,
            sameSite: "lax",
            path: "/",
        });

        return res.status(200).json({
            message: `Login Successfull`,
            user: {
                message: `Hello ${user.name}`,
            },
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

        const token = createToken(
            user._id.toString(),
            user.email,
            "7d"
        );

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie(COOKIES_NAME, token, {
            httpOnly: true,
            signed: true,
            sameSite: "lax",
            expires,
            path: "/",
        });

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

export const handleuserdetail= (req,res)=>{
    return res.status(200).json({
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
        }
    });
}