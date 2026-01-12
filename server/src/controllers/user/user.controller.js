import { success } from "zod";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    getUserDataService,
    requestEmailChangeService,
    updateProfileService,
    verifyEmailChangeOtpService,
} from "../../services/user/user.service.js";
import { CONSTANTS } from "../../constants/constants.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await getUserDataService(userId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            data: {
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

export const updateProfile = async (req, res) => {
    try {
        const { fullname, phone } = req.body;
        console.log(req.file);
        const updatedUser = await updateProfileService(req.user._id, { fullname, phone }, req.file);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.PROFILE_UPDATED_SUCCESSFULLY,
            data: {
                user: updatedUser,
            },
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const requestEmailChange = async (req, res) => {
    try {
        const { email } = req.body;
        await requestEmailChangeService(req.user._id, email);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.OTP_SEND,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const verifyEmailChangeOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const result = await verifyEmailChangeOtpService(req.user._id, otp);
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.EMAIL_UPDATED,
            user: result,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
