import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { couponRepository } from "../../repositories/coupon.repo.js";

export const getAdminCouponsService = async (page = 1, limit = 10, search = "") => {
    let filter = {};
    if (search) {
        filter.code = { $regex: search, $options: "i" };
    }
    
    const count = await couponRepository.countAll(filter);
    const coupons = await couponRepository.findWithPagination(filter, page, limit);
    
    return {
        coupons,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalCoupons: count,
    };
};

export const createCouponService = async (data) => {
    const existing = await couponRepository.findByCodeString(data.code.toUpperCase());
    if (existing) {
        const error = new Error(ERROR_MESSAGES.COUPON_CODE_ALREADY_EXISTS);
        error.statusCode = 400;
        throw error;
    }

    if (data.expiryDate) {
        if (new Date(data.expiryDate) <= new Date()) {
            const error = new Error(ERROR_MESSAGES.EXPIRY_DATE_MUST_BE_IN_FUTURE);
            error.statusCode = 400;
            throw error;
        }
    }
    
    if (data.startDate && data.expiryDate) {
        if (new Date(data.startDate) >= new Date(data.expiryDate)) {
            const error = new Error(ERROR_MESSAGES.EXPIRY_DATE_MUST_BE_AFTER_START_DATE);
            error.statusCode = 400;
            throw error;
        }
    }

    return await couponRepository.create({ ...data, code: data.code.toUpperCase() });
};

export const getCouponByIdService = async (id) => {
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
        const error = new Error(ERROR_MESSAGES.COUPON_NOT_FOUND);
        error.statusCode = 404;
        throw error;
    }
    return coupon;
};

export const updateCouponService = async (id, data) => {
    if (data.code) {
        const existing = await couponRepository.findByCodeString(data.code.toUpperCase());
        if (existing && existing._id.toString() !== id) {
            const error = new Error(ERROR_MESSAGES.COUPON_CODE_ALREADY_EXISTS);
            error.statusCode = 400;
            throw error;
        }
        data.code = data.code.toUpperCase();
    }

    if (data.expiryDate) {
        if (new Date(data.expiryDate) <= new Date()) {
            const error = new Error(ERROR_MESSAGES.EXPIRY_DATE_MUST_BE_IN_FUTURE);
            error.statusCode = 400;
            throw error;
        }
    }

    if (data.startDate && data.expiryDate) {
        if (new Date(data.startDate) >= new Date(data.expiryDate)) {
            const error = new Error(ERROR_MESSAGES.EXPIRY_DATE_MUST_BE_AFTER_START_DATE);
            error.statusCode = 400;
            throw error;
        }
    } else if (data.startDate || data.expiryDate) {
        const existingCoupon = await couponRepository.findById(id);
        const start = data.startDate ? new Date(data.startDate) : new Date(existingCoupon.startDate);
        const end = data.expiryDate ? new Date(data.expiryDate) : new Date(existingCoupon.expiryDate);

        if (start >= end) {
            const error = new Error(ERROR_MESSAGES.EXPIRY_DATE_MUST_BE_AFTER_START_DATE);
            error.statusCode = 400;
            throw error;
        }
    }

    const updated = await couponRepository.update(id, data);
    if (!updated) {
        const error = new Error(ERROR_MESSAGES.COUPON_NOT_FOUND);
        error.statusCode = 404;
        throw error;
    }
    return updated;
};

export const toggleCouponStatusService = async (id) => {
    const coupon = await couponRepository.findById(id);
    if (!coupon) {
        const error = new Error(ERROR_MESSAGES.COUPON_NOT_FOUND);
        error.statusCode = 404;
        throw error;
    }
    return await couponRepository.update(id, { isActive: !coupon.isActive });
};
