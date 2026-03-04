import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/user/order.service";
import { toast } from "react-hot-toast";

export const useReturnOrderItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, itemId, reason }) => orderService.returnOrder(orderId, itemId, reason),
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            queryClient.invalidateQueries({ queryKey: ["userOrders"] });
            toast.success("Return request submitted successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to submit return request");
        }
    });
};
