import bcrypt from "bcrypt";
import { findUserByEmail, createUser, findUserByReferralCode, setReferredBy, findUserByRefreshToken } from "../../repositories/user.repo.js";
import { generateAccessToken,generateRefreshToken, verifyToken } from "../../utils/jwt.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { generateReferralCode } from "../../utils/referralCode.js";
export const signUpService = async (userData) => {
    console.log(userData)
    // Check if email exists
    const existing = await findUserByEmail(userData?.email);
    if (existing) {
        const error = new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if(userData.password !== userData.confirmPassword){
        const error = new Error(ERROR_MESSAGES.PASSWORD_MISMATCH);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
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

    // If no code found after 10 tries
    if(!referalCode){
      referalCode = `${Date.now().toString(36).toUpperCase()}`;
    }

    // Create User 
    const userInfo = {
      fullname : userData.fullname,
      email : userData.email,
      phone : userData.phone,
      password: hashedPassword,
      referralCode : referalCode
    }
    const user = await createUser(userInfo);

    // Client provides referral Code
    if(userData.referralCode){
      const referrer = await findUserByReferralCode(userData.referralCode);
      if(referrer){
        await setReferredBy(user._id, referrer._id);
      }else{
        const error = new Error(ERROR_MESSAGES.INVALID_REFERRAL_CODE);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
      }
    }
    // Create JWT token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user)
    
    user.refreshToken = refreshToken;
    await user.save()
    // REST API Response
    return {
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked,
            referralCode: user.referralCode,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        accessToken,
        refreshToken
    };
};


export const refreshTokenService = async (oldToken)=>{
  const user = await findUserByRefreshToken(oldToken);
  if(!user){
    const error = new Error("Invalid refresh token")
    error.statusCode = STATUS_CODES.BAD_REQUEST
    throw error
  }

  verifyToken(oldToken);

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save()

  return {newAccessToken , newRefreshToken}
}