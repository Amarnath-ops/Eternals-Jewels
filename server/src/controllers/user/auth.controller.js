import { CONSTANTS } from "../../constants/constants.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    changePasswordService,
    forgotPasswordOTPService,
    forgotPasswordVerifyService,
    googleCallbackService,
    loginService,
    logoutService,
    refreshTokenService,
    resendOTPService,
    resetPasswordService,
    signUpService,
    verifyOTPService,
} from "../../services/user/auth.service.js";
import validateData from "../../utils/validation.js";
import {
    emailSchema,
    loginSchema,
    otpEmailSchema,
    resetPasswordSchema,
    signupSchema,
} from "../../validations/auth.validation.js";

export const signup = async (req, res) => {
    try {
        const validatedData = validateData(req.body, signupSchema);
        console.log(validatedData);
        const { fullname, email, phone, password, confirmPassword, referredBy } = validatedData.data;
        const result = await signUpService({ fullname, email, phone, password, confirmPassword, referredBy });

        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            statusCode: STATUS_CODES.CREATED,
            message: result.message,
        });
    } catch (error) {
        return res
            .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR, fieldName: error.fieldName });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        const { newRefreshToken, newAccessToken, user } = await refreshTokenService(refreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
            path: "/",
        });

        return res.status(STATUS_CODES.OK).json({
            data: {
                accessToken: newAccessToken,
                user,
            },
        });
    } catch (error) {
        res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const login = async (req, res) => {
    const validatedData = validateData(req.body, loginSchema);
    try {
        const { email, password } = validatedData.data;
        const { user, accessToken, refreshToken } = await loginService({ email, password });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
            path: "/",
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            statusCode: STATUS_CODES.OK,
            message: "User login success",
            data: {
                user,
                token: accessToken,
            },
        });
    } catch (error) {
        return res
            .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        await logoutService(refreshToken);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        return res.json({ message: "Logged out" });
    } catch (error) {
        return res
            .status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json({ message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        console.log(req.body)
        const validatedData = validateData(req.body, otpEmailSchema);
        const { email, otp } = validatedData.data;
        const result = await verifyOTPService({ email, otp });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
            path: "/",
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.OTP_VERIFIED,
            data: {
                user: result.user,
                token: result.accessToken,
            },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { data } = validateData(req.body, emailSchema);
        console.log(req.body, data);
        const { email } = data;
        const result = await resendOTPService(email);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const forgotPasswordOTP = async (req, res) => {
    try {
        const { data } = validateData(req.body, emailSchema);
        const { email } = data;
        const result = await forgotPasswordOTPService(email);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const forgotPasswordVerify = async (req, res) => {
    try {
        const { data } = validateData(req.body, otpEmailSchema);
        const { email, otp } = data;
        const result = await forgotPasswordVerifyService(email, otp);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: true,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { data } = validateData(req.body, resetPasswordSchema);
        const { email, password, confirmPassword } = data;
        const result = await resetPasswordService(email, password, confirmPassword);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
            path: "/",
        });
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: result.message,
            data: {
                token: result.accessToken,
                user: result.user,
            },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        const { refreshToken, accessToken } = await googleCallbackService(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
            path: "/",
        });
        res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${accessToken}`);
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const result = await changePasswordService(req.user._id,req.body)
        return res.status(STATUS_CODES.OK).json({
            success:true,
            data:result
        })
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
