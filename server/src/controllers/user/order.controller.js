import { CONSTANTS } from "../../constants/constants.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    placeOrderService,
    getOrdersService,
    cancelOrderService,
    getOrderByIdService,
    returnOrderService,
    cancelOrderItemService,
    verifyPaymentService,
    retryPaymentService,
} from "../../services/user/order.service.js";

export const placeOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod, couponCode } = req.body;

        if (!addressId || !paymentMethod) {
            const error = new Error(ERROR_MESSAGES.ADDRESS_AND_PAYMENT_METHOD_REQUIRED);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        const order = await placeOrderService(req.user._id, { addressId, paymentMethod, couponCode });

        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: CONSTANTS.ORDER_PLACED_SUCCESSFULLY,
            orderId: order._id,
            razorpayOrderId: order.razorpayOrderId,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY_ID,
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
            message: CONSTANTS.ORDERS_FETCHED_SUCCESSFULLY,
            orders,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await getOrderByIdService(req.user._id, orderId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.ORDER_FETCHED_SUCCESSFULLY,
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
            message: CONSTANTS.ORDER_CANCELLED_SUCCESSFULLY,
            order,
        });
    } catch (error) {
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
            const error = new Error(ERROR_MESSAGES.RETURN_REASON_REQUIRED);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }

        const order = await returnOrderService(req.user._id, orderId, itemId, reason);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.ORDER_RETURNED_SUCCESSFULLY,
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
            message: CONSTANTS.ORDER_ITEM_CANCELLED_SUCCESSFULLY,
            order,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
        const isVerified = await verifyPaymentService(orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature);
        if (isVerified) {
            return res.status(STATUS_CODES.OK).json({ success: true, message: CONSTANTS.PAYMENT_VERIFIED_SUCCESSFULLY });
        } else {
            return res
                .status(STATUS_CODES.BAD_REQUEST)
                .json({ success: false, message: ERROR_MESSAGES.INVALID_PAYMENT_SIGNATURE });
        }
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        }); 
    }
};

export const retryPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await retryPaymentService(req.user._id, orderId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.PAYMENT_RETRY_INITIATED_SUCCESSFULLY,
            orderId: order._id,
            razorpayOrderId: order.razorpayOrderId,
            amount: order.amount,
            key: order.key,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
