import { useQuery } from "@tanstack/react-query";
import { adminCouponService } from "../../../../services/admin/coupon.service";

export const useGetAdminCoupons = (page, limit, search) => {
    return useQuery({
        queryKey: ["adminCoupons", page, limit, search],
        queryFn: () => adminCouponService.getCoupons(page, limit, search),
        keepPreviousData: true,
    });
};

export const useGetCouponById = (id) => {
    return useQuery({
        queryKey: ["adminCoupon", id],
        queryFn: () => adminCouponService.getCouponById(id),
        enabled: !!id,
    });
};
