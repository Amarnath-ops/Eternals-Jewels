import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/user/order.service.js";
import { QUERY_KEYS } from "@/lib/queryKeys";

export const usePlaceOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: orderService.placeOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_CART] });
        },
        onError: (error) => {
            console.log(error);
        },
    });
};
