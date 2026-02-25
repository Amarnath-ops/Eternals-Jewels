import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const reportRepository = {
    getSalesReport: async (startDate, endDate, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;

        const query = {
            createdAt: { $gte: startDate, $lte: endDate },
            orderStatus: { $nin: ["Cancelled", "Returned"] }
        };

        const totalOrdersCount = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .populate("user", "fullname email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const summary = await Order.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalSalesCount: { $sum: 1 },
                    totalOrderAmount: { $sum: "$totalAmount" },
                    totalDiscount: { $sum: "$discountAmount" },
                    totalFinalAmount: { $sum: "$finalAmount" }
                }
            }
        ]);

        const totalCustomers = await User.countDocuments({ isAdmin: false });

        const pendingOrders = await Order.countDocuments({
            orderStatus: { $in: ["Pending", "Processing", "Shipped"] },
            createdAt: { $gte: startDate, $lte: endDate }
        });

        return {
            orders,
            totalOrders: totalOrdersCount,
            totalPages: Math.ceil(totalOrdersCount / limit),
            currentPage: page,
            summary: summary[0] || {
                totalSalesCount: 0,
                totalOrderAmount: 0,
                totalDiscount: 0,
                totalFinalAmount: 0
            },
            totalCustomers,
            pendingOrders
        };
    },

    getAllSalesReportData: async (startDate, endDate) => {
        const query = {
            createdAt: { $gte: startDate, $lte: endDate },
            orderStatus: { $nin: ["Cancelled", "Returned"] }
        };

        return await Order.find(query)
            .populate("user", "fullname email")
            .sort({ createdAt: -1 });
    },

    getDashboardStats: async () => {
        const totalCustomers = await User.countDocuments({ isAdmin: false });
        const totalOrders = await Order.countDocuments({ orderStatus: { $nin: ["Cancelled"] } });
        
        const salesSummary = await Order.aggregate([
            { $match: { orderStatus: { $nin: ["Cancelled", "Returned"] } } },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$finalAmount" }
                }
            }
        ]);

        const pendingOrders = await Order.countDocuments({
            orderStatus: { $in: ["Pending", "Processing", "Shipped"] }
        });

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() + 1); // Start from next month to get exactly 12
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const salesOverviewRaw = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo },
                    orderStatus: { $nin: ["Cancelled", "Returned"] }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    revenue: { $sum: { $convert: { input: "$finalAmount", to: "double", onError: 0, onNull: 0 } } },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        const salesOverview = [];
        const currDate = new Date(twelveMonthsAgo);
        
        for (let i = 0; i < 12; i++) {
            const m = currDate.getMonth() + 1;
            const y = currDate.getFullYear();
            
            const monthData = salesOverviewRaw.find(item => item._id.month === m && item._id.year === y);
            
            salesOverview.push({
                _id: { month: m, year: y },
                revenue: monthData ? monthData.revenue : 0,
                orders: monthData ? monthData.orders : 0
            });

            currDate.setMonth(currDate.getMonth() + 1);
        }
        const ordersTrend = salesOverview.map(item => ({
            month: item._id.month,
            orders: item.orders
        }));

        const topProducts = await Order.find({ orderStatus: { $nin: ["Cancelled"] } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "fullname email");

        return {
            summary: {
                totalCustomers,
                totalOrders,
                totalSales: salesSummary[0]?.totalSales || 0,
                pendingOrders
            },
            salesOverview,
            ordersTrend,
            topProducts
        };
    }
};
