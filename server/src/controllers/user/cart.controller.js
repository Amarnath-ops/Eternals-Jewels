import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    addToCartService,
    getCartService,
    removeFromCartService,
    updateQuantityService,
} from "../../services/user/cart.service.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId, quantity } = req.body;

        const cart = await addToCartService(userId, productId, variantId, quantity);
        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            cart,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await getCartService(userId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            cart,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId, quantity } = req.body;

        const cart = await updateQuantityService(userId, productId, variantId, quantity);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            cart,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId } = req.body;

        const cart = await removeFromCartService(userId, productId, variantId);
        return res.status(STATUS_CODES.OK).json({
            success: true,
            cart,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
