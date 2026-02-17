import { cartServices } from "@/services/user/cart.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useUpdateCartQuantity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartServices.updateQuantity,
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries([QUERY_KEYS.USER_CART]);
            toast.success("Cart updated");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "Failed to update cart");
        },
    });
};
