import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCouponService } from "../../../../services/admin/coupon.service";
import toast from "react-hot-toast";

export const useCreateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminCouponService.createCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
            toast.success("Coupon created successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create coupon");
        },
    });
};

export const useUpdateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminCouponService.updateCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
            queryClient.invalidateQueries({ queryKey: ["adminCoupon"] });
            toast.success("Coupon updated successfully");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update coupon");
        },
    });
};

export const useToggleCouponStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminCouponService.toggleStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
            toast.success("Coupon status updated");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to toggle status");
        },
    });
};
