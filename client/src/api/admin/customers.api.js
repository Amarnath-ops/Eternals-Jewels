import axiosInstance from "../axios"

export const getAllCustomersApi = async(params)=>{
  const res =  await axiosInstance.get("/admin/customers",{params});
  console.log(res)
  return res.data.data
}

export const toggleBlockUserApi = (userId)=>{
  return axiosInstance.patch(`admin/customers/${userId}/status`)
}