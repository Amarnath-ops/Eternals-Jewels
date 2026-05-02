import { orderRepository } from "../../repositories/order.repo.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { productRepository } from "../../repositories/product.repo.js";
export const getAllOrdersService = async (page = 1, limit = 10, search = "", status = "", days = 0, sortBy = "newest") => {
    return await orderRepository.findAllOrders(page, limit, search, status, days, sortBy);
};

export const getOrderByIdService = async (orderId) => {
    const order = await orderRepository.findOrderById(orderId);
    if (!order) {
        const error = new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }
    return order;
};

export const updateOrderStatusService = async (orderId, status) => {
    const order = await orderRepository.findOrderById(orderId);
    if (!order) {
        const error = new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const statusPrecedence = {
        Pending: 1,
        Processing: 2,
        Shipped: 3,
        Delivered: 4,
        Cancelled: 5,
        Returned: 6,
    };

    const currentPrecedence = statusPrecedence[order.orderStatus] || 0;
    const newPrecedence = statusPrecedence[status] || 0;

    if (newPrecedence < currentPrecedence && order.orderStatus !== "Cancelled" && order.orderStatus !== "Returned") {
        const error = new Error(ERROR_MESSAGES.CANNOT_REVERT_ORDER_STATUS);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (order.orderStatus === "Cancelled") {
        const error = new Error(ERROR_MESSAGES.CANNOT_CHANGE_STATUS_OF_CANCELLED_ORDER);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (order.orderStatus === "Delivered" && status !== "Returned") {
        const error = new Error(ERROR_MESSAGES.DELIVERED_ORDERS_CAN_ONLY_BE_MARKED_AS_RETURNED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    if (status === "Cancelled" || status === "Returned") {
        await Promise.all(
            order.orderItems.map(item => {
                if (item.itemStatus !== "Cancelled" && item.itemStatus !== "Returned") {
                    return productRepository.updateStock(item.product, item.variantId, -item.quantity);
                }
                return Promise.resolve();
            })
        );
    }

    return await orderRepository.updateOrderStatus(orderId, status);
};

export const updateOrderItemStatusService = async (orderId, itemId, status) => {
    const order = await orderRepository.findOrderById(orderId);
    if (!order) {
        const error = new Error(ERROR_MESSAGES.ORDER_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const item = order.orderItems.id(itemId);
    if (!item) {
        const error = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    const statusPrecedence = {
        Pending: 1,
        Processing: 2,
        Shipped: 3,
        Delivered: 4,
        Cancelled: 5,
        "Return Requested": 6,
        Returned: 7,
    };

    const currentPrecedence = statusPrecedence[item.itemStatus] || 0;
    const newPrecedence = statusPrecedence[status] || 0;

    const isReturnToProcess = item.itemStatus === "Return Requested" && (status === "Processing" || status === "Delivered");

    if (
        newPrecedence < currentPrecedence &&
        item.itemStatus !== "Cancelled" &&
        item.itemStatus !== "Returned" &&
        !isReturnToProcess
    ) {
        const error = new Error(ERROR_MESSAGES.CANNOT_REVERT_ORDER_STATUS);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (item.itemStatus === "Cancelled") {
        const error = new Error(ERROR_MESSAGES.CANNOT_CHANGE_STATUS_OF_CANCELLED_ITEM);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (item.itemStatus === "Delivered" && status !== "Returned" && status !== "Return Requested") {
        const error = new Error(ERROR_MESSAGES.DELIVERED_ITEMS_CAN_ONLY_BE_MARKED_AS_RETURNED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (status === "Cancelled" || status === "Returned") {
        if (item.itemStatus !== "Cancelled" && item.itemStatus !== "Returned") {
            await productRepository.updateStock(item.product, item.variantId, -item.quantity);
        }
    }

    return await orderRepository.updateOrderItemStatus(orderId, itemId, status);
};
