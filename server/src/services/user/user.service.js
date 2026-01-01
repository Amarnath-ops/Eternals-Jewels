import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { findUserById } from "../../repositories/user.repo.js"

export const getUserDataService = async (userId)=>{
  const user = await findUserById(userId);
  if(!user){
    const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    error.statusCode = STATUS_CODES.NOT_FOUND;
    throw error
  }
  if(user.isBlocked){
    const error = new Error(ERROR_MESSAGES.USER_BLOCKED);
    error.statusCode = STATUS_CODES.FORBIDDEN;
    throw error
  }

  return {
    user :{
      _id:user._id,
      fullname:user.fullname,
      email:user.email,
      provider: user.provider,
      isAdmin:user.isAdmin
    }
  }
}