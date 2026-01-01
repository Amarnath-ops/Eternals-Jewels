import { ERROR_MESSAGES } from "../constants/errorMessage.js";
import { STATUS_CODES } from "../constants/statusCode.js";
import jwt, { decode } from "jsonwebtoken";
import { findUserById } from "../repositories/user.repo.js";
export const protect = async (req, res,next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success:false,
                message: ERROR_MESSAGES.UNAUTHORIZED,
            });
        }
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await findUserById(decoded._id);

        if (!user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success:false,
                message:ERROR_MESSAGES.USER_NOT_FOUND
            });
        }
        req.user = {
          _id :user._id,
          fullname:user.fullname ,
          email:user.email
        }
        next()
    } catch (error) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success:false,
            error,
            message: error.message || ERROR_MESSAGES.TOKEN_EXPIRED,
        });
    }
};
