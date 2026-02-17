import { placeOrderApi, getOrdersApi, cancelOrderApi } from "../../api/users/order.api";

export const orderService = {
    placeOrder: async (data) => {
        return await placeOrderApi(data);
    },
    getOrders: async (page = 1, limit = 5) => {
        return await getOrdersApi(page, limit);
    },
    cancelOrder: async (orderId) => {
        return await cancelOrderApi(orderId);
    }
};
