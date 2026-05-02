import { CONSTANTS } from "../../constants/constants.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { adminLoginService, adminLogoutService, adminRefreshTokenSerive } from "../../services/admin/auth.service.js";
import validateData from "../../utils/validation.js";
import { loginSchema } from "../../validations/auth.validation.js";

export const adminLogin = async (req, res) => {
    try {
        const validData = validateData(req.body, loginSchema);
        console.log(validData);
        const { email, password } = validData.data;
        const data = await adminLoginService({ email, password });

        res.cookie("adminRefreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
            path: "/",
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.ADMIN_LOGIN,
            data: {
                accessToken: data.accessToken,
                admin: {
                    _id: data.user._id,
                    fullname: data.user.fullname,
                    email: data.user.email,
                    isAdmin: data.user.isAdmin,
                },
            },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const adminLogout = async (req, res) => {
    try {
        const { adminRefreshToken } = req.cookies;
        await adminLogoutService(adminRefreshToken);
        res.clearCookie("adminRefreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.ADMIN_LOGOUT,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const adminRefresh = async (req, res) => {
    try {
        const { adminRefreshToken } = req.cookies;
        const result = await adminRefreshTokenSerive(adminRefreshToken);
        res.cookie("adminRefreshToken", result.newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
            path: "/",
        });
        return res.status(STATUS_CODES.OK).json({
          success:true,
          data:{
            accessToken:result.newAccessToken,
            user:result.user
          }
        })
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
