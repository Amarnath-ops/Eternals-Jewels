import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { refreshTokenService, signUpService } from "../../services/user/auth.service.js";

export const signup = async (req, res) => {
  try{
    const { fullname, email, phone, password, confirmPassword, referralCode } = req.body;
    const result = await signUpService({ fullname, email, phone, password ,confirmPassword, referralCode });

    res.cookie("refreshToken", result.refreshToken,{
      httpOnly :true,
      secure:true,
      sameSiteL:"strict",
      maxAge: process.env.REFRESH_TOKEN_MAX_AGE
    });

    return res.status(STATUS_CODES.CREATED).json({
        status: true,
        statusCode: STATUS_CODES.CREATED,
        message: "User registered Successfully",
        data :{
          token : result.accessToken,
          user : result.user
        }
    });
  }catch(error){
    return res.status(error.statusCode || 500).json({message:error.message || "Internal server error"})
  }
};

export const refresh = async(req,res)=>{
  try{
    const {refreshToken} = req.cookies;
    if(!refreshToken){
      const error = new Error(ERROR_MESSAGES.UNAUTHORIZED)
      error.statusCode = STATUS_CODES.UNAUTHORIZED
      throw error
    }

    const {newRefreshToken, newAccessToken} = await refreshTokenService(refreshToken)

    res.cookie("refreshToken",newRefreshToken,{
      httpOnly:true,
      secure:true,
      sameSite : "strict",
      maxAge : process.env.REFRESH_TOKEN_MAX_AGE
    })

    return res.json({
      data:{
        accesstoken : newAccessToken
      }
    })
  }catch(error){
    res.status(error.statusCode || 500).json({message : error.message || "Internal server error"})
  }
}