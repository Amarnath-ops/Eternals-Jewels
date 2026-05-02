import { STATUS_CODES } from "../constants/statusCode.js";
const validateData = (data,schema)=>{
  const validatedData = schema.safeParse(data);
      if (!validatedData.success) { 
        
        const error = validatedData.error;
        console.log(error)
        throw {
          statusCode:STATUS_CODES.BAD_REQUEST,
          message:JSON.parse(error.message)[0].message
        }
      }
      return validatedData
}
export default validateData