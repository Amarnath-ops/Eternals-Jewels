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

export const clearRefreshTokenById = async (id) => {
    return User.findByIdAndUpdate(id, { refreshToken: null }, { new: true });
};

export const setUserPasswordById = async (id, hashedpassword) => {
    const user = await User.findById(id);
    user.password = hashedpassword;
    await user.save();
    return user;
};
