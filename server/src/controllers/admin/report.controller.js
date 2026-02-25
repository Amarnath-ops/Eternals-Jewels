import { 
    getSalesReportService, 
    getFullSalesReportDataService,
    getDashboardStatsService
} from "../../services/admin/report.service.js";
import { STATUS_CODES } from "../../constants/statusCode.js";
import { ERROR_MESSAGES } from "../../constants/errorMessage.js";
import { CONSTANTS } from "../../constants/constants.js";


export const getDashboardStats = async (req, res) => {
    try {
        const stats = await getDashboardStatsService();
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.DASHBOARD_STATS_FETCHED_SUCCESSFULLY,
            data: stats
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const getSalesReport = async (req, res) => {
    try {
        const { filterType, startDate, endDate } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const reportData = await getSalesReportService(
            filterType, 
            startDate, 
            endDate, 
            page, 
            limit
        );

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.SALES_REPORT_FETCHED_SUCCESSFULLY,
            data: reportData
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};

export const downloadSalesReport = async (req, res) => {
    try {
        const { filterType, startDate, endDate } = req.query;

        const reportData = await getFullSalesReportDataService(
            filterType, 
            startDate, 
            endDate
        );

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: CONSTANTS.SALES_REPORT_DATA_FOR_DOWNLOAD_FETCHED_SUCCESSFULLY,
            data: reportData
        });
    } catch (error) {
        return res.status(error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        });
    }
};
