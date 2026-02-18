import { placeOrderApi, getOrdersApi, cancelOrderApi, getOrderByIdApi, returnOrderApi, cancelOrderItemApi } from "../../api/users/order.api";

export const orderService = {
    placeOrder: async (data) => {
        return await placeOrderApi(data);
    },
    getOrders: async (page = 1, limit = 5, search = "") => {
        return await getOrdersApi(page, limit, search);
    },
    getOrderById: async (orderId) => {
        return await getOrderByIdApi(orderId);
    },
    cancelOrder: async (orderId) => {
        return await cancelOrderApi(orderId);
    },
    returnOrder: async (orderId, itemId, reason) => {
        return await returnOrderApi(orderId, itemId, reason);
    },
    cancelOrderItem: async (orderId, itemId) => {
        return await cancelOrderItemApi(orderId, itemId);
    }
};
