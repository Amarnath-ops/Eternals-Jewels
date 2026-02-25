import {
    getAdminCouponsApi,
    createCouponApi,
    getCouponByIdApi,
    updateCouponApi,
    toggleCouponStatusApi,
} from "../../api/admin/coupon.api";

export const adminCouponService = {
    getCoupons: async (page, limit, search) => {
        try {
            const response = await getAdminCouponsApi(page, limit, search);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createCoupon: async (data) => {
        try {
            const response = await createCouponApi(data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCouponById: async (id) => {
        try {
            const response = await getCouponByIdApi(id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateCoupon: async ({ id, data }) => {
        try {
            const response = await updateCouponApi(id, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggleStatus: async (id) => {
        try {
            const response = await toggleCouponStatusApi(id);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
