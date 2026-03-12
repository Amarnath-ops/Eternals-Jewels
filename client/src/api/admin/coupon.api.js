import axiosInstance from "../axios";

export const getAdminCouponsApi = async (page = 1, limit = 10, search = "") => {
    return await axiosInstance.get(`/admin/coupons?page=${page}&limit=${limit}&search=${search}`);
};

export const createCouponApi = async (data) => {
    return await axiosInstance.post(`/admin/coupons`, data);
};

export const getCouponByIdApi = async (id) => {
    return await axiosInstance.get(`/admin/coupons/${id}`);
};

export const updateCouponApi = async (id, data) => {
    return await axiosInstance.put(`/admin/coupons/${id}`, data);
};

export const toggleCouponStatusApi = async (id) => {
    return await axiosInstance.patch(`/admin/coupons/${id}/status`);
};

export const deleteCouponApi = async (id) => {
    return await axiosInstance.delete(`/admin/coupons/${id}`);
};
