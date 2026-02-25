import { applyCouponApi, getCouponsApi } from "../../api/users/coupon.api";

export const couponService = {
    getCoupons: async () => {
        try {
            const response = await getCouponsApi();
            return response.data;
        } catch (error) {
            console.error("Get coupons Service Error", error);
            throw error;
        }
    },
    applyCoupon: async (couponData) => {
        try {
            const response = await applyCouponApi(couponData);
            return response.data;
        } catch (error) {
            console.error("Apply coupon Service Error", error);
            throw error;
        }
    },
};
