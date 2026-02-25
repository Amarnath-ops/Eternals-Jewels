import { STATUS_CODES } from "../../constants/statusCode.js";
import {
    getAdminCouponsService,
    createCouponService,
    getCouponByIdService,
    updateCouponService,
    toggleCouponStatusService
} from "../../services/admin/coupon.service.js";

export const getCoupons = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        
        const result = await getAdminCouponsService(page, limit, search);
        res.status(STATUS_CODES.OK).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

export const createCoupon = async (req, res, next) => {
    try {
        const coupon = await createCouponService(req.body);
        res.status(STATUS_CODES.CREATED).json({
            success: true,
            data: coupon,
            message: "Coupon created successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getCouponById = async (req, res, next) => {
    try {
        const coupon = await getCouponByIdService(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        next(error);
    }
};

export const updateCoupon = async (req, res, next) => {
    try {
        const coupon = await updateCouponService(req.params.id, req.body);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: coupon,
            message: "Coupon updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const toggleCouponStatus = async (req, res, next) => {
    try {
        const coupon = await toggleCouponStatusService(req.params.id);
        res.status(STATUS_CODES.OK).json({
            success: true,
            data: coupon,
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        next(error);
    }
};
