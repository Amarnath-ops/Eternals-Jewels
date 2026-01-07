import User from "../models/user.model.js";

// Check user is exists or not
export const findUserByEmail = async (email) => {
    return User.findOne({ email });
};

// Create new User
export const createUser = async ({ ...userData }) => {
    const user = await User.create(userData);
    return user;
};

// Find the user with the given ReferralCode
export const findUserByReferralCode = async (code) => {
    return User.findOne({ referralCode: code });
};

// Set referredBy of the User
export const setReferredBy = async (userId, referrerId) => {
    return User.findByIdAndUpdate(userId, { referredBy: referrerId }, { new: true });
};

// find user by jwt refresh token
export const findUserByRefreshToken = async (token) => {
    return User.findOne({ refreshToken: token });
};

// To remove the refresh token

export const clearRefreshTokenByRefreshToken = async (refreshToken) => {
    const user = await User.findOne({ refreshToken: refreshToken });
    user.refreshToken = null;
    await user.save();
    return user;
};

export const setUserPasswordById = async (id, hashedpassword) => {
    const user = await User.findById(id);
    user.password = hashedpassword;
    await user.save();
    return user;
};

export const findUserById = async (id) => {
    return User.findById(id);
};

export const setRefreshTokenByEmail = async (email, refreshToken) => {
    const user = await User.findOne({ email });
    user.refreshToken = refreshToken;
    await user.save();
    return user;
};

export const updateUserById = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, {
        new: true,
    });
};
