import { useQuery } from "@tanstack/react-query";
import { getSalesReportService } from "../../../../services/admin/report.service";

export const useGetSalesReport = (filterType, startDate, endDate, page, limit) => {
    return useQuery({
        queryKey: ["salesReport", filterType, startDate, endDate, page, limit],
        queryFn: () => getSalesReportService({ filterType, startDate, endDate, page, limit }),
        keepPreviousData: true,
    });
};
