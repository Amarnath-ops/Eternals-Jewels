import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { clearRefreshTokenByRefreshToken, findUserByEmail, findUserByRefreshToken } from "../../repositories/user.repo.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../../utils/jwt.js";
export const adminLoginService = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }
    if (!user.isAdmin) {
        const error = new Error(ERROR_MESSAGES.ACCESS_DENIED);
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        const error = new Error(ERROR_MESSAGES.INVALID_PASSWORD);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    return {
        accessToken,
        refreshToken,
        user,
    };
};

export const adminLogoutService = async (token) => {
    return await clearRefreshTokenByRefreshToken(token);
};

export const adminRefreshTokenSerive = async (oldToken) => {
    if (!oldToken) {
        const error = new Error(ERROR_MESSAGES.UNAUTHORIZED);
        error.statusCode = STATUS_CODES.UNAUTHORIZED;
        throw error;
    }
    const user = await findUserByRefreshToken(oldToken);
    if (!user) {
        const error = new Error(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }
    if (!user.isAdmin) {
        const error = new Error(ERROR_MESSAGES.ADMIN_ONLY);
        error.statusCode = STATUS_CODES.FORBIDDEN;
        throw error;
    }
    if (user.isBlocked) {
        const error = new Error(ERROR_MESSAGES.USER_BLOCKED);
        error.statusCode = STATUS_CODES.FORBIDDEN;
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
            isAdmin: user.isAdmin,
        },
    };
};
