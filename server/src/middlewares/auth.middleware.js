import { ERROR_MESSAGES } from "../constants/errorMessage.js";
import { STATUS_CODES } from "../constants/statusCode.js";
import jwt from "jsonwebtoken";
export const protect = async (req, res,next) => {
    try {
        const authHeader = req.headers?.authorization;
        console.log(authHeader)
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success:false,
                message: ERROR_MESSAGES.UNAUTHORIZED,
            });
        }
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          _id :decoded._id,
          isAdmin:decoded.isAdmin
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
