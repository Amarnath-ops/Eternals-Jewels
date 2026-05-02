import { STATUS_CODES } from "../../constants/statusCode.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import {
    addToWishlistService,
    getWishlistService,
    removeFromWishlistService,
    clearWishlistService,
    moveItemToCartService,
} from "../../services/user/wishlist.service.js";
import { CONSTANTS } from "../../constants/constants.js";

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId } = req.body;

        const wishlist = await addToWishlistService(userId, productId, variantId);

        return res.status(STATUS_CODES.CREATED).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await getWishlistService(userId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId } = req.body;

        const wishlist = await removeFromWishlistService(userId, productId, variantId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            wishlist,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        await clearWishlistService(userId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.WISHLIST_CLEARED_SUCCESSFULLY,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const moveItemToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, variantId } = req.body;

        await moveItemToCartService(userId, productId, variantId);

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.WISHLIST_ITEM_MOVED_TO_CART_SUCCESSFULLY,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
