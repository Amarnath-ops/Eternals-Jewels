import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/user/order.service";

export const useGetOrders = (page = 1, limit = 5) => {
    return useQuery({
        queryKey: ["userOrders", page, limit],
        queryFn: () => orderService.getOrders(page, limit),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, 
    });
};
