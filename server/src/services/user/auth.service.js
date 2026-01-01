import bcrypt from "bcrypt";
import {
    findUserByEmail,
    createUser,
    findUserByReferralCode,
    setReferredBy,
    findUserByRefreshToken,
    setUserPasswordById,
    clearRefreshTokenByRefreshTOken,
} from "../../repositories/user.repo.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/jwt.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { generateReferralCode } from "../../utils/referralCode.js";
import cache from "../../utils/node.cache.js";
import generateOTP from "../../utils/otp.generator.js";
import { CONSTANTS } from "../../constants/constants.js";
import { sendMail } from "../../utils/nodemailer.js";
export const signUpService = async (userData) => {
    // Check if email exists
    const existing = await findUserByEmail(userData?.email);
    if (existing) {
        const error = new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        error.fieldName = "email";
        throw error;
    }

    if (userData.password !== userData.confirmPassword) {
        const error = new Error(ERROR_MESSAGES.PASSWORD_MISMATCH);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        error.fieldName = "confirmPassword";
        throw error;
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(userData?.password, 10);

    // Generate unique referal code
    let referalCode;
    for (let i = 0; i < 5; i++) {
        const codeForTest = generateReferralCode(userData?.fullname);
        const userFound = await findUserByReferralCode(codeForTest);
        if (!userFound) {
            referalCode = codeForTest;
            break;
        }
    }

    // If no code found after 5 tries
    if (!referalCode) {
        referalCode = `${Date.now().toString(36).toUpperCase()}`;
    }

    // Create User
    const userInfo = {
        fullname: userData.fullname,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        referralCode: referalCode,
    };
    const user = await createUser(userInfo);

    // Client provides referral Code
    if (userData.referredBy) {
        const referrer = await findUserByReferralCode(userData.referredBy);
        if (referrer) {
            await setReferredBy(user._id, referrer._id);
        } else {
            const error = new Error(ERROR_MESSAGES.INVALID_REFERRAL_CODE);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            error.fieldName = "referredBy";
            throw error;
        }
    }
    const otp = generateOTP();

    cache.set(`verify_${user.email}`, otp, CONSTANTS.OTP_CACHE_TIME);
    console.log(otp);
    await sendMail(user.email, otp);
    // REST API Response
    return {
        message: CONSTANTS.OTP_SEND,
    };
};

export const refreshTokenService = async (oldToken) => {
    const user = await findUserByRefreshToken(oldToken);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    verifyToken(oldToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
        newAccessToken,
        newRefreshToken,
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
        },
    };
};

export const loginService = async (userData) => {
    const user = await findUserByEmail(userData.email);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }

    const validPassword = await bcrypt.compare(userData.password, user.password);
    if (!validPassword) {
        const error = new Error(ERROR_MESSAGES.INVALID_PASSWORD);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
};

export const logoutService = async (rToken) => {
    await clearRefreshTokenByRefreshTOken(rToken)
};

export const verifyOTPService = async ({ email, otp }) => {
    const user = await findUserByEmail(email);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.USER_NOT_FOUND;
        throw error;
    }

    const cachedOTP = cache.get(`verify_${email}`);
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

    user.isVerified = true;
    await user.save();
    cache.del(`verify_${email}`);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.save();

    return {
        refreshToken,
        accessToken,
        user: {
            fullname: user.fullname,
            id: user._id,
        },
    };
};

export const resendOTPService = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    if (user.isVerified) {
        const error = new Error(ERROR_MESSAGES.ALREADY_VERIFIED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const otp = generateOTP();
    cache.set(`verify_${email}`, otp, CONSTANTS.OTP_CACHE_TIME);
    console.log(otp);
    await sendMail(email, otp);

    return {
        message: CONSTANTS.OTP_RESEND,
    };
};

export const forgotPasswordOTPService = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    const otp = generateOTP();

    cache.set(`verify_${email}`, otp, CONSTANTS.OTP_CACHE_TIME);
    console.log(otp);
    await sendMail(email, otp);

    return {
        message: CONSTANTS.OTP_SEND,
    };
};

export const forgotPasswordVerifyService = async (email, otp) => {
    const user = await findUserByEmail(email);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const cachedOTP = cache.get(`verify_${email}`);
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

    cache.del(`verify_${email}`);

    return {
        message: CONSTANTS.OTP_VERIFIED_FOR_FORGOT,
    };
};

export const resetPasswordService = async (email, password, confirmPassword) => {
    const user = await findUserByEmail(email);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (password !== confirmPassword) {
        const error = new Error(ERROR_MESSAGES.PASSWORD_MISMATCH);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await setUserPasswordById(user._id, hashedPassword);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    return {
        message: CONSTANTS.PASSWORD_RESET_SUCCESS,
        refreshToken,
        accessToken,
        user: {
            _id: user._id,
            email: user.email,
            name: user.fullname,
        },
    };
};


export const googleCallbackService = (user)=>{
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user)

    return {
        accessToken,
        refreshToken
    }
}