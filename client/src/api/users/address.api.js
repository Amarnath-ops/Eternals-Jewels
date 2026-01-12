import axiosInstance from "../axios";

export const getAddressApi = async () => {
    try {
        const res = await axiosInstance.get("/users/address");
        return res.data.data;
    } catch (error) {
        console.log(error);
        throw error
    }
};


export const addAddressApi = async (data)=>{
  try {
    const res = await axiosInstance.post("/users/address",
      data
    )
    return res.data.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateAddressApi = async ({addressId,data})=>{
  try {
    const res = await axiosInstance.put(`/users/address/${addressId}`,data)
    return res.data.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteAddressApi = async (addressId)=>{
  const res = await axiosInstance.delete(`/users/address/${addressId}`)
  return res.data
}