import User from "../models/user.model.js";


export const findUserByEmail = async (email) => {
    return User.findOne({ email });
};


export const createUser = async ({ ...userData }) => {
    const user = await User.create(userData);
    return user;
};


export const findUserByReferralCode = async (code) => {
    return User.findOne({ referralCode: code });
};


export const setReferredBy = async (userId, referrerId) => {
    return User.findByIdAndUpdate(userId, { referredBy: referrerId }, { new: true });
};


export const findUserByRefreshToken = async (token) => {
    return User.findOne({ refreshToken: token });
};



export const clearRefreshTokenByRefreshToken = async (refreshToken) => {
    console.log(refreshToken)
    const user = await User.findOne({ refreshToken });
    console.log(user)
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
    return User.findById(id).select("-password");
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
    }).select("-passsword -refreshToken -__v");
};

export const findCustomers = async (query, skip, limit) => {
    return await User.find(query).select(" -password -refreshToken").skip(skip).limit(limit).sort({ createdAt: -1 });
};

export const countCustomers = async(query)=>{
    return await User.countDocuments(query)
}

export const toggleBlockStatus = async (id)=>{
    const user = await User.findById(id);
    if(!user) return null;

    user.isBlocked = !user.isBlocked;
    return await user.save()
}