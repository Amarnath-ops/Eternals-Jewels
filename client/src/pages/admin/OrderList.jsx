import React, { useState, useEffect } from "react";
import { useGetAllOrders } from "@/hooks/tanstack_Queries/admin/order/useGetAllOrders";
import { SpinnerBadge } from "@/components/Spinner";
import Pagination from "@/components/Pagination";
import { Search, Eye, X } from "lucide-react";
import { Link } from "react-router-dom";

const OrderList = () => {
    const [page, setPage] = useState(1);
    const limit = 5;
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    
    const [dateFilter, setDateFilter] = useState("All Time");

    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const getDaysFromFilter = (filter) => {
        switch(filter) {
            case "24 Hour": return 1;
            case "7 Days": return 7;
            case "30 Days": return 30;
            case "12 Months": return 365;
            default: return 0;
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setDebouncedSearch("");
        setStatusFilter("");
        setDateFilter("All Time");
        setSortBy("newest");
        setPage(1);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, isError } = useGetAllOrders(page, limit, debouncedSearch, statusFilter, getDaysFromFilter(dateFilter), sortBy);

    const orders = data?.data?.orders || [];
    const totalPages = data?.data?.totalPages || 1;
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "Processing": return "bg-blue-100 text-blue-800";
            case "Shipped": return "bg-indigo-100 text-indigo-800";
            case "Delivered": return "bg-green-100 text-green-800";
            case "Cancelled": return "bg-red-100 text-red-800";
            case "Returned": return "bg-gray-100 text-gray-800";
            case "Return Requested": return "bg-orange-100 text-orange-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Order</h1>
                    <nav className="text-sm text-gray-500 mt-1">
                        <span>Dashboard</span> <span className="mx-1">&gt;</span> <span className="text-gray-800 font-medium">Order List</span>
                    </nav>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search Order..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e6b58] focus:border-transparent bg-white text-sm w-64 shadow-sm"
                    />
                    {search && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setPage(1);
                            }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex bg-gray-100/50 p-1 rounded-lg">
                        {["All Time", "12 Months", "30 Days", "7 Days", "24 Hour"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setDateFilter(filter)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                                    dateFilter === filter 
                                    ? "bg-white text-gray-900 shadow-sm" 
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                         <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7e6b58] bg-white cursor-pointer"
                        >
                            <option value="">All Status</option>
                            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7e6b58] bg-white cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="price_asc">Price: Low to High</option>
                        </select>

                        {(search || statusFilter || dateFilter !== "All Time" || sortBy !== "newest") && (
                            <button 
                                onClick={handleClearFilters}
                                className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1c1c1c] text-white text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium rounded-tl-lg">Order ID</th>
                                <th className="px-6 py-4 font-medium">Products</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Payment</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center">
                                        <div className="flex justify-center">
                                            <SpinnerBadge content="Loading Orders..." />
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-red-500">
                                        Failed to fetch orders.
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-[#7e6b58] font-medium">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                                                    {order.orderItems?.[0]?.image ? (
                                                        <img 
                                                            src={order.orderItems[0].image} 
                                                            alt="" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 truncate max-w-37.5">
                                                        {order.orderItems?.[0]?.productName}
                                                    </span>
                                                    {order.orderItems?.length > 1 && (
                                                        <span className="text-xs text-gray-500">
                                                            + {order.orderItems.length - 1} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {order.shippingAddress?.fullname || order.user?.fullname || "Unknown"}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {order.user?.email || "No Email"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ₹ {order.finalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {order.paymentMethod}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus).replace('text-', 'border-').replace('bg-', 'bg-opacity-20 ')} ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    to={`/admin/orders/${order._id}`} 
                                                    className="p-1.5 text-gray-500 hover:text-[#7e6b58] hover:bg-[#7e6b58]/10 rounded-md transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                    <Pagination 
                        currentPage={page} 
                        totalPages={totalPages} 
                        onPageChange={setPage} 
                        className="justify-end"
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderList;
