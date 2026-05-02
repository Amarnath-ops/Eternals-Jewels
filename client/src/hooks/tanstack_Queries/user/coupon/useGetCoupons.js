import { useQuery } from "@tanstack/react-query";
import { couponService } from "../../../../services/user/coupon.service";

export const useGetCoupons = () => {
    return useQuery({
        queryKey: ["coupons"],
        queryFn: couponService.getCoupons,
    });
};
