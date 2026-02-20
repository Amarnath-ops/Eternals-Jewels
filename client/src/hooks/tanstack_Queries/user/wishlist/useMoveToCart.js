import { wishlistServices } from "@/services/user/wishlist.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useMoveToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistServices.moveToCart,
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.USER_WISHLIST]);
            queryClient.invalidateQueries([QUERY_KEYS.USER_CART]);
            toast.success("Moved to cart");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || error.message || "Failed to move to cart");
        },
    });
};
