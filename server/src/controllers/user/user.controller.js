import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { findUserById } from "../../repositories/user.repo.js"
import { getUserDataService } from "../../services/user/user.service.js";

export const getUserData = async(req,res)=>{
  try {
    const userId = req.user._id
    const result = await getUserDataService(userId);
    
    return res.status(STATUS_CODES.OK).json({
      success:true,
      data:{
        user:result.user
      }
    })
  } catch (error) {
    return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success:false,
      message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
  }

}