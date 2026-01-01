import axiosInstance from "./axios";

export const logoutApi = async () => await axiosInstance.post("/auth/logout");