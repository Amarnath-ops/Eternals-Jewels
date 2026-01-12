import cloudinary from "../../config/cloudinary.js";
import { CONSTANTS } from "../../constants/constants.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { findUserByEmail, findUserById, updateUserById } from "../../repositories/user.repo.js";
import generateAvatar from "../../utils/avatar.js";
import cache from "../../utils/node.cache.js";
import { sendMail } from "../../utils/nodemailer.js";
import generateOTP from "../../utils/otp.generator.js";

export const getUserDataService = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    if (user.isBlocked) {
        const error = new Error(ERROR_MESSAGES.USER_BLOCKED);
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }

    return {
        user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            provider: user.provider,
            isVerified: user.isVerified,
            avatar: user.avatar.url,
        },
    };
};

export const updateProfileService = async (userId, body, file) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            error.statusCode = STATUS_CODES.NOT_FOUND;
            throw error;
        }
        if (user.isBlocked) {
            const error = new Error(ERROR_MESSAGES.USER_BLOCKED);
            error.statusCode = STATUS_CODES.FORBIDDEN;
            throw error;
        }
        if (file) {
            if (user.avatar?.provider === "cloudinary") {
                await cloudinary.uploader.destroy(user.avatar.publicId);
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result);
                });
                stream.end(file.buffer);
            });

            body.avatar = {
                provider: "cloudinary",
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
            };
        }
        const updatedUser = await updateUserById(userId, body);
        return updatedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const requestEmailChangeService = async (userId, email) => {
    try {
        const isExist = await findUserByEmail(email)
        if(isExist){
            const error = new Error(ERROR_MESSAGES.EMAIL_IN_USE);
            error.statusCode = STATUS_CODES.BAD_REQUEST
            throw error
        }
        const user = await findUserById(userId);
        if(user.provider === "google"){
            const error = new Error(ERROR_MESSAGES.EMAIL_CANNOT_BE_CHANGED_FOR_GOOGLE);
            error.statusCode = STATUS_CODES.CONFLICT
            throw error
        }
        if (!user) {
            const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            error.statusCode = STATUS_CODES.NOT_FOUND;
            throw error;
        }

        const otp = generateOTP();
        console.log(otp)
        cache.set(`email_for_${user._id}`,email, CONSTANTS.OTP_CACHE_TIME)

        cache.set(`verify_${email}`, otp, CONSTANTS.OTP_CACHE_TIME);

        await sendMail(email, otp);
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const verifyEmailChangeOtpService = async (userId, otp) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
            error.statusCode = STATUS_CODES.NOT_FOUND;
            throw error;
        }
        const changedEmail = cache.get(`email_for_${user.id}`)
        const cachedOTP = cache.get(`verify_${changedEmail}`);
        if (!cachedOTP) {
            const error = new Error(ERROR_MESSAGES.OTP_EXPIRED);
            error.statusCode = STATUS_CODES.GONE;
            throw error;
        }

        if (cachedOTP !== otp) {
            const error = new Error(ERROR_MESSAGES.INVALID_OTP);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        user.email = changedEmail;
        await user.save()
        return user
    } catch (error) {
        console.error(error);
        throw error;
    }
};
