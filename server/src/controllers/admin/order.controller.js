import { 
    getAllOrdersService, 
    getOrderByIdService, 
    updateOrderStatusService, 
    updateOrderItemStatusService 
} from "../../services/admin/order.service.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";

export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || "";
        const search = req.query.search || "";
        const days = parseInt(req.query.days) || 0;
        const sortBy = req.query.sortBy || "newest";
        
        const { orders, totalPages, currentPage, totalOrders } = await getAllOrdersService(page, limit, search, status, days, sortBy);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Orders fetched successfully",
            data: {
                orders,
                totalPages,
                currentPage,
                totalOrders
            }
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
        const order = await getOrderByIdService(orderId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Status is required"
            });
        }

        const order = await updateOrderStatusService(orderId, status);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const updateOrderItemStatus = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const { status } = req.body;

        if (!status) {
             return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Status is required"
            });
        }

        const order = await updateOrderItemStatusService(orderId, itemId, status);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Order item status updated successfully",
            data: order
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
