import { cartServices } from "@/services/user/cart.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartServices.addToCart,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries([QUERY_KEYS.USER_CART]);
            toast.success("Added to your cart.");
        },
    });
};
