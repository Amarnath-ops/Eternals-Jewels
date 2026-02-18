import axiosInstance from "../axios.js";

export const placeOrderApi = async (data) => {
    const res = await axiosInstance.post("/orders", data);
    return res.data;
};

export const getOrdersApi = async (page = 1, limit = 5, search = "") => {
    const res = await axiosInstance.get(`/orders?page=${page}&limit=${limit}&search=${search}`);
    return res.data;
};

export const cancelOrderApi = async (orderId) => {
    const res = await axiosInstance.patch(`/orders/${orderId}/cancel`);
    return res.data;
};

export const getOrderByIdApi = async (orderId) => {
    const res = await axiosInstance.get(`/orders/${orderId}`);
    console.log(res)
    return res.data;
};

export const returnOrderApi = async (orderId, itemId, reason) => {
    const res = await axiosInstance.patch(`/orders/${orderId}/return/${itemId}`, { reason });
    return res.data;
};

export const cancelOrderItemApi = async (orderId, itemId) => {
    const res = await axiosInstance.patch(`/orders/${orderId}/cancel/${itemId}`);
    return res.data;
};
