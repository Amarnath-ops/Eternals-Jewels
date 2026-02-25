import axiosInstance from "../axios";

export const getWalletApi = async (page = 1, limit = 5) => {
    return await axiosInstance.get(`/wallet?page=${page}&limit=${limit}`);
};
