import axiosInstance from "../axios";

export const getAllOrdersApi = async (page = 1, limit = 10, search = "", status = "", days = 0, sortBy = "newest") => {
    const res = await axiosInstance.get(`/admin/orders?page=${page}&limit=${limit}&search=${search}&status=${status}&days=${days}&sortBy=${sortBy}`);
    return res.data;
};

export const getOrderByIdApi = async (orderId) => {
    const res = await axiosInstance.get(`/admin/orders/${orderId}`);
    return res.data;
};

export const updateOrderStatusApi = async (orderId, status) => {
    const res = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
    return res.data;
};

export const updateOrderItemStatusApi = async (orderId, itemId, status) => {
    const res = await axiosInstance.patch(`/admin/orders/${orderId}/items/${itemId}/status`, { status });
    return res.data;
};
