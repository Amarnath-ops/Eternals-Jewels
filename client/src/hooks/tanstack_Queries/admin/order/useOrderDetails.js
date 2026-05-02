import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrderService } from "@/services/admin/order.service";
import toast from "react-hot-toast";

export const useGetOrderById = (orderId) => {
    return useQuery({
        queryKey: ["adminOrder", orderId],
        queryFn: () => adminOrderService.getOrderById(orderId),
        enabled: !!orderId,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, status }) => adminOrderService.updateOrderStatus(orderId, status),
        onSuccess: (data, variables) => {
            toast.success("Order status updated successfully");
            queryClient.invalidateQueries(["adminOrder", variables.orderId]);
            queryClient.invalidateQueries(["adminOrders"]);
            queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["userOrders"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update order status");
        },
    });
};

export const useUpdateOrderItemStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, itemId, status }) => adminOrderService.updateOrderItemStatus(orderId, itemId, status),
        onSuccess: (data, variables) => {
            toast.success("Item status updated successfully");
            queryClient.invalidateQueries(["adminOrder", variables.orderId]);
            queryClient.invalidateQueries(["adminOrders"]);
            queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["userOrders"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update item status");
        },
    });
};
