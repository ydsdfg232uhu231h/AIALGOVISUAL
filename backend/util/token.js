import jwt from "jsonwebtoken";
import { COOKIES_NAME } from "./content.js";
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: expiresIn,
    });

    return token;
}

export const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[COOKIES_NAME];
    console.log("mytoken",token)
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not Resived" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
        if (err) {
            return res.status(401).json({ message: "Token Expired" });
        }

        console.log("Token Verification Successful");
        
        res.locals.jwtData = success;
        next();

    })

}