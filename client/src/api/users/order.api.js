import axiosInstance from "../axios.js";

export const placeOrderApi = async (data) => {
    const res = await axiosInstance.post("/orders", data);
    return res.data;
};

export const getOrdersApi = async (page = 1, limit = 5) => {
    const res = await axiosInstance.get(`/orders?page=${page}&limit=${limit}`);
    return res.data;
};

export const cancelOrderApi = async (orderId) => {
    const res = await axiosInstance.patch(`/orders/${orderId}/cancel`);
    return res.data;
};
