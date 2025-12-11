import { statusCodes } from "../../constants/statusCode.js";
import { signUpService } from "../../services/user/auth.service.js";

export const signUp = async (req, res) => {
  try{
    const { fullname, email, phone, password } = req.body;
    const response = await signUpService({ fullname, email, phone, password });

    return res.status(statusCodes.CREATED).json({
        status: true,
        statusCode: statusCodes.CREATED,
        message: "User registered Successfully",
        data :{
          token : response.token,
          user : response.user
        }
    });
  }catch(error){
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({message:error.message || "Internal Server Error"})
  }
};
