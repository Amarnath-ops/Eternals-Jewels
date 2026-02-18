import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/user/order.service";

export const useGetOrders = (page = 1, limit = 5, search = "") => {
    return useQuery({
        queryKey: ["userOrders", page, limit, search],
        queryFn: () => orderService.getOrders(page, limit, search),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000, 
    });
};
