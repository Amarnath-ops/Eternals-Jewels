import { reportRepository } from "../../repositories/report.repo.js";

export const getSalesReportService = async (filterType, startDate, endDate, page, limit) => {
    let start = new Date();
    let end = new Date();

    if (filterType === "daily") {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
    } else if (filterType === "weekly") {
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
    } else if (filterType === "30days") {
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
    } else if (filterType === "yearly") {
        start.setFullYear(start.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);
    } else if (filterType === "custom") {
        start = new Date(startDate);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
    } else {
        start = new Date(0);
    }

    return await reportRepository.getSalesReport(start, end, page, limit);
};

export const getFullSalesReportDataService = async (filterType, startDate, endDate) => {
    let start = new Date();
    let end = new Date();

    if (filterType === "daily") {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
    } else if (filterType === "weekly") {
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
    } else if (filterType === "30days") {
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
    } else if (filterType === "yearly") {
        start.setFullYear(start.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);
    } else if (filterType === "custom") {
        start = new Date(startDate);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
    } else {
        start = new Date(0);
    }

    return await reportRepository.getAllSalesReportData(start, end);
};

export const getDashboardStatsService = async () => {
    return await reportRepository.getDashboardStats();
};
