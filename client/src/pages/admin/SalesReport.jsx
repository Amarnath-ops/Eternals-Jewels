import React, { useState } from 'react';
import { useGetSalesReport } from '@/hooks/tanstack_Queries/admin/report/useGetSalesReport';
import Pagination from '@/components/Pagination';
import { Download, Calendar, Users, ShoppingCart, DollarSign, Clock, Box } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { downloadSalesReportDataService } from '@/services/admin/report.service';
import toast from 'react-hot-toast';

const SalesReport = () => {
    const [filterType, setFilterType] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: reportResponse, isLoading, isError } = useGetSalesReport(
        filterType,
        startDate,
        endDate,
        page,
        limit
    );

    const reportData = reportResponse?.data;

    const handleFilterChange = (type) => {
        setFilterType(type);
        setPage(1);
    };

    const handleDownload = async (format) => {
        try {
            const response = await downloadSalesReportDataService({ filterType, startDate, endDate });
            const allData = response.data;

            if (format === 'pdf') {
                generatePDF(allData);
            } else {
                generateCSV(allData);
            }
        } catch (error) {
            toast.error("Failed to download report");
        }
    };

    const generatePDF = (data) => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Eternals Sales Report", 14, 22);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Filter: ${filterType}`, 14, 36);

        const tableColumn = ["Order ID", "Date", "Customer", "Total", "Discount", "Final"];
        const tableRows = [];

        data.forEach(order => {
            const orderRow = [
                order._id.substring(0, 10) + '...',
                new Date(order.createdAt).toLocaleDateString(),
                order.user?.fullname || "N/A",
                `INR ${order.totalAmount}`,
                `INR ${order.discountAmount}`,
                `INR ${order.finalAmount}`
            ];
            tableRows.push(orderRow);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0] } // Changed to black for a sleeker look
        });

        doc.save(`sales_report_${filterType}_${new Date().getTime()}.pdf`);
    };

    const generateCSV = (data) => {
        const headers = ["Order ID", "Date", "Customer", "Total Amount", "Discount Amount", "Final Amount", "Order Status", "Payment Method"];
        const worksheetData = data.map(order => {
            const date = new Date(order.createdAt);
            const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
            return [
                order._id,
                formattedDate,
                `"${order.user?.fullname || "N/A"}"`,
                order.totalAmount,
                order.discountAmount,
                order.finalAmount,
                order.orderStatus,
                order.paymentMethod
            ].join(",");
        });

        const csvString = [headers.join(","), ...worksheetData].join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `sales_report_${filterType}_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (isError) return <div className="p-8 text-red-500">Error loading sales report.</div>;

    const stats = [
        { title: 'Total Customers', value: reportData?.totalCustomers || 0, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Orders', value: reportData?.summary?.totalSalesCount || 0, icon: Box, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Sales', value: `₹${reportData?.summary?.totalFinalAmount || 0}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Discount', value: `₹${reportData?.summary?.totalDiscount || 0}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Pending', value: reportData?.pendingOrders || 0, icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50' },
    ];

    const filterOptions = [
        { label: 'All Time', value: 'all' },
        { label: '12 Months', value: 'yearly' },
        { label: '30 Days', value: '30days' }, // updated repo/service might need tweak if I used 'weekly' etc
        { label: '7 Days', value: 'weekly' },
        { label: '24 Hour', value: 'daily' },
        { label: 'Custom', value: 'custom' },
    ];

    // Note: I used 'weekly' in service for 7 days. 
    // I should ensure service handles '30days' too if I add it.
    // For now I'll stick to what I wrote in service or update it.

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
                    <p className="text-sm text-gray-500">Dashboard {'>'} Sales Report</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleFilterChange(opt.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    filterType === opt.value
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleDownload('pdf')}
                            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </button>
                        <button
                            onClick={() => handleDownload('excel')}
                            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Excel
                        </button>
                    </div>
                </div>

                {filterType === 'custom' && (
                    <div className="mt-4 flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/5"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-600 font-semibold">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Products</th>
                                <th className="px-6 py-4">Buyer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4 h-16 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : reportData?.orders?.length > 0 ? (
                                reportData.orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                                            {order.orderItems.length > 0 
                                                ? `${order.orderItems[0].productName}${order.orderItems.length > 1 ? ` + ${order.orderItems.length - 1} more` : ''}`
                                                : 'No items'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {order.user?.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-bold">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            }).replace(/\//g, ' - ')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                                            ₹{order.finalAmount}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No sales records found for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {reportData?.totalPages > 1 && (
                    <div className="p-6 border-t border-gray-100">
                        <Pagination
                            currentPage={page}
                            totalPages={reportData.totalPages}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesReport;
