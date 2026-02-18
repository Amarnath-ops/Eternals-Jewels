import { getAllOrdersApi } from "../../api/admin/order.api";
import { getOrderByIdApi } from "../../api/admin/order.api";
import { updateOrderStatusApi } from "../../api/admin/order.api";
import { updateOrderItemStatusApi } from "../../api/admin/order.api";
export const adminOrderService = {
    getAllOrders: async (page = 1, limit = 10, search = "", status = "", days = 0, sortBy = "newest") => {
        return await getAllOrdersApi(page, limit, search, status, days, sortBy);
    },
    getOrderById: async (orderId) => {
        return await getOrderByIdApi(orderId);
    },
    updateOrderStatus: async (orderId, status) => {
        return await updateOrderStatusApi(orderId, status);
    },
    updateOrderItemStatus: async (orderId, itemId, status) => {
        return await updateOrderItemStatusApi(orderId, itemId, status);
    }
};
