import { cartServices } from "@/services/user/cart.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartServices.clearCart,
        onSuccess: (data) => {
            queryClient.invalidateQueries([QUERY_KEYS.USER_CART]);
            toast.success("Cart cleared");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Failed to clear cart");
        },
    });
};
