import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "../../../../services/admin/report.service";

export const useGetDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: getDashboardStatsService,
    });
};
