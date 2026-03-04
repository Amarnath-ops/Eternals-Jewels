import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/user/order.service";

export const useGetOrderDetails = (orderId) => {
    return useQuery({
        queryKey: ["order", orderId],
        queryFn: () => orderService.getOrderById(orderId),
        enabled: !!orderId,
    });
};
