import { CONSTANTS } from "../../constants/constants.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    getAdminCouponsService,
    createCouponService,
    getCouponByIdService,
    updateCouponService,
    toggleCouponStatusService
} from "../../services/admin/coupon.service.js";
import validateData from "../../utils/validation.js";
import { couponSchema, updateCouponSchema } from "../../validations/coupon.schema.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";

export const getCoupons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        
        const result = await getAdminCouponsService(page, limit, search);
        res.status(STATUS_CODES.OK).json({ success: true, ...result, message: CONSTANTS.COUPON_FETCHED_SUCCESSFULLY });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const validated = validateData(req.body, couponSchema);
        const coupon = await createCouponService(validated.data);
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            data: coupon,
            message: CONSTANTS.COUPON_CREATED
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getCouponById = async (req, res) => {
    try {
        const coupon = await getCouponByIdService(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: coupon,
            message: CONSTANTS.COUPON_FETCHED_SUCCESSFULLY
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const validated = validateData(req.body, updateCouponSchema);
        const coupon = await updateCouponService(req.params.id, validated.data);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: coupon,
            message: CONSTANTS.COUPON_UPDATED_SUCCESSFULLY
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await toggleCouponStatusService(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: coupon,
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
