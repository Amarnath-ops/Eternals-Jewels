import bcrypt from "bcrypt"
import { findUserByEmail, createUser } from "../../repositories/user.repo.js";
import { generateToken } from "../../utils/generate.token.js";
import {statusCodes} from "../../constants/statusCode.js"
export const signUpService = async (userData)=>{
  // Check if email exists
  const existing = await findUserByEmail(userData?.email);
  if(existing){
    const error = new Error("Email already registered");
    error.statusCode = statusCodes.BAD_REQUEST;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData?.password,10);

  // Create new user
  const user = await createUser({...userData, password:hashedPassword })

  //Create JWT token
  const token = generateToken(user)

  // REST API Response
  return {
      token,
      user:{
        id: user._id,
        fullname : user.fullname,
        email:user.email,
        phone:user.phone,
        isAdmin:user.isAdmin,
        isBlocked:user.isBlocked,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
  }
}