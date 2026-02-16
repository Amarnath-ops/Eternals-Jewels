import { cartServices } from "@/services/user/cart.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartServices.removeFromCart,
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries([QUERY_KEYS.USER_CART]);
            toast.success("Removed from cart");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Failed to remove from cart");
        },
    });
};
