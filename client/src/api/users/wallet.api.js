import axiosInstance from "../axios";

export const getWalletApi = async () => {
    return await axiosInstance.get('/wallet');
};
