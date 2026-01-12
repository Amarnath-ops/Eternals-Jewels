import axiosInstance from "../axios";

export const changePasswordApi = async (data)=>{
try {
  const res = await axiosInstance.post("/auth/change-password",data)
  return res.data.data
} catch (error) {
  console.log(error);
  throw error
}
}