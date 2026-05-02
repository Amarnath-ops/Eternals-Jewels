import axiosInstance from "../axios";

export const adminLoginApi = async (data) => {
    const res = await axiosInstance.post("admin/auth/login", {
        email: data.email,
        password: data.password,
    });
    return res.data.data
};

export const adminLogoutApi = async ()=>{
  const res = await axiosInstance.post("admin/auth/logout");
  return res.data
}