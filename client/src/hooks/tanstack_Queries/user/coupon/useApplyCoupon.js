import { useMutation } from "@tanstack/react-query";
import { couponService } from "@/services/user/coupon.service";

export const useApplyCoupon = () => {
    return useMutation({
        mutationFn: couponService.applyCoupon,
    });
};
