import axiosInstance from "../axios";

export const getCouponsApi = async () => {
    return await axiosInstance.get('/coupons');
};

export const applyCouponApi = async (data) => {
    return await axiosInstance.post("/coupons/apply", data);
};
