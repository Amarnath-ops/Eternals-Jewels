import { ERROR_MESSAGES } from "../constants/errorMessage.js"
import { STATUS_CODES } from "../constants/statusCode.js"

export const onlyAdmin = (req,res,next)=>{
  if(!req.user.isAdmin){
    return res.status(STATUS_CODES.FORBIDDEN).json({
      message:ERROR_MESSAGES.ADMIN_ONLY
    })
  }
  next()
}