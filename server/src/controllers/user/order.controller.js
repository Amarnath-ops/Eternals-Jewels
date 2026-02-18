import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { placeOrderService, getOrdersService, cancelOrderService, getOrderByIdService, returnOrderService, cancelOrderItemService } from "../../services/user/order.service.js";

export const placeOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod } = req.body;
        
        if (!addressId || !paymentMethod) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Address and Payment Method are required",
            });
        }

        const order = await placeOrderService(req.user._id, { addressId, paymentMethod });

        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: "Order placed successfully.",
            orderId: order._id,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const search = req.query.search || "";

        const { orders, totalPages } = await getOrdersService(req.user._id, page, limit, search);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Orders fetched successfully",
            orders,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
    }




export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await getOrderByIdService(req.user._id, orderId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Order fetched successfully",
            order,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await cancelOrderService(req.user._id, orderId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });
    }
    catch(error){
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const returnOrder = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const { reason } = req.body;
        
        if (!reason) {
             return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Return reason is required",
            });
        }

        const order = await returnOrderService(req.user._id, orderId, itemId, reason);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Return requested successfully",
            order,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const cancelOrderItem = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const order = await cancelOrderItemService(req.user._id, orderId, itemId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Order item cancelled successfully",
            order,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
