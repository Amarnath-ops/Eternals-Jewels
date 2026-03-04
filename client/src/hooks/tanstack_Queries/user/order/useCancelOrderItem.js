import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/user/order.service";
import { toast } from "react-hot-toast";

export const useCancelOrderItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, itemId }) => orderService.cancelOrderItem(orderId, itemId),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            queryClient.invalidateQueries({ queryKey: ["userOrders"] });
            toast.success("Item cancelled successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to cancel item");
        }
    });
};
