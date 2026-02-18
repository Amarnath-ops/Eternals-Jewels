import { useQuery } from "@tanstack/react-query";
import { adminOrderService } from "@/services/admin/order.service";

export const useGetAllOrders = (page = 1, limit = 10, search = "", status = "", days = 0, sortBy = "newest") => {
    return useQuery({
        queryKey: ["adminOrders", page, limit, search, status, days, sortBy],
        queryFn: () => adminOrderService.getAllOrders(page, limit, search, status, days, sortBy),
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
    });
};
