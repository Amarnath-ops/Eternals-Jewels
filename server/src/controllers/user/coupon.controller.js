import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { validateCouponService, getCouponsService } from "../../services/user/coupon.service.js";

export const applyCoupon = async (req, res,) => {
    try {
        const { code, totalAmount } = req.body;
        const userId = req.user._id;

        if (!code || !totalAmount) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: "Coupon code and total amount are required",
            });
        }

        const result = await validateCouponService(userId, code, totalAmount);

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: result,
            message: "Coupon applied successfully",
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getCoupons = async (req, res) => {
    try {
        const coupons = await getCouponsService();
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: coupons,
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
