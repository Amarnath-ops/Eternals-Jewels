import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { couponRepository } from "../../repositories/coupon.repo.js";

export const getCouponsService = async () => {
    return await couponRepository.findAll({ isActive: true });
};

export const validateCouponService = async (userId, code, totalAmount) => {
    if (!userId) {
        const error = new Error(ERROR_MESSAGES.USER_VALIDATION_FAILED_FOR_COUPON);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }
    
    const coupon = await couponRepository.findByCode(code.toUpperCase());

    if (!coupon) {
        const error = new Error(ERROR_MESSAGES.INVALID_OR_INACTIVE_COUPON_CODE);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    const now = new Date();
    
    if (new Date(coupon.startDate) > now) {
        const error = new Error(ERROR_MESSAGES.COUPON_NOT_YET_VALID);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (now > new Date(coupon.expiryDate)) {
        const error = new Error(ERROR_MESSAGES.COUPON_EXPIRED);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (totalAmount < coupon.minPurchaseAmount) {
        const error = new Error(`Minimum purchase amount of ₹${coupon.minPurchaseAmount} is required for this coupon.`);
        error.statusCode = STATUS_CODES.BAD_REQUEST;
        throw error;
    }

    if (coupon.usedBy && Array.isArray(coupon.usedBy)) {
        const userUsage = coupon.usedBy.find((entry) => {
            if (!entry || !entry.user) return false;
            
            const entryUserId = typeof entry.user === 'object' && entry.user._id 
                ? entry.user._id.toString() 
                : entry.user.toString();
                
            return entryUserId === userId.toString();
        });
        
        if (userUsage && userUsage.usedCount >= coupon.usageLimitPerUser) {
            const error = new Error(`You have already used this coupon maximum allowed times (${coupon.usageLimitPerUser}).`);
            error.statusCode = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
    }
    let discount = 0;
    if (coupon.discountType === "percentage") {
        discount = (totalAmount * coupon.discountAmount) / 100;
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
            discount = coupon.maxDiscountAmount;
        }
    } else if (coupon.discountType === "fixed") {
        discount = coupon.discountAmount;
    }
    if (discount > totalAmount) {
        discount = totalAmount;
    }

    return {
        couponId: coupon._id,
        code: coupon.code,
        discountAmount: discount,
        finalTotal: totalAmount - discount,
    };
};
