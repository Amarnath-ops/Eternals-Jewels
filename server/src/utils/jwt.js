import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ERROR_MESSAGES } from "../constants/errorMessage.js";
import { STATUS_CODES } from "../constants/statusCode.js";

config();

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            const error = new Error(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
            error.statusCode = STATUS_CODES.FORBIDDEN;
            throw error
        }
    });
};
