import axiosInstance from "@/api/axios";

export const getSalesReportService = async (params) => {
    const response = await axiosInstance.get("/admin/reports", { params });
    return response.data;
};

export const downloadSalesReportDataService = async (params) => {
    const response = await axiosInstance.get("/admin/reports/download", { params });
    return response.data;
};

export const getDashboardStatsService = async () => {
    const response = await axiosInstance.get("/admin/reports/stats");
    return response.data;
};
