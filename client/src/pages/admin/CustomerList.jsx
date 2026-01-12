import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, X, Loader } from "lucide-react";
import { useCustomers } from "@/hooks/tanstack_Queries/admin/customers/useCustomers";
import { useDebounce } from "@/hooks/useDebounce";
import { useToggleBlockUser } from "@/hooks/tanstack_Queries/admin/customers/useToggleBlockUser";

const CustomerList = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10
    const [statusFilter, setStatusFilter] = useState("All");
    const debouncedSearch = useDebounce(search, 500);
    
    const { data, isLoading } = useCustomers({
        search: debouncedSearch,
        page,
        limit,
        status: statusFilter,
    });
    
    const { mutateAsync: toggleBlock, isPending } = useToggleBlockUser();
    
    const totalCustomers = data?.total || 0;
    const totalPages = data?.totalPages || 1;
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, totalCustomers);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleToggle = (customer) => {
        const confirm = window.confirm(`Are you sure you want to ${customer.isBlocked ? "unblock" : "block"} this user?`);
        if (!confirm) return;
        toggleBlock(customer._id);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', 
            month: 'short', 
            year: 'numeric'
        });
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-poppins text-gray-900 mb-1">CUSTOMER LIST</h1>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    <span>Dashboard</span>
                    <span className="text-gray-400">›</span>
                    <span className="text-gray-600 font-medium">CUSTOMERS</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full max-w-md group">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search customer..."
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-200 border-none rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-all placeholder-gray-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />

                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="bg-[#ecfdf3] p-1 rounded-lg flex items-center">
                    {["All", "Active", "Blocked"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                statusFilter === status
                                    ? "bg-white text-green-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    {/* Table Header */}
                    <thead className="bg-[#1a7f37] text-white text-xs uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Customer Name</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Orders</th>
                            <th className="px-6 py-4">Balance</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">
                                <div className="flex items-center gap-1 cursor-pointer">BLOCK/ UNBLOCK</div>
                            </th>
                            {/* Changed from Action to Joined On */}
                            <th className="px-6 py-4">Joined On</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-100 translate-x-115">
                                <Loader className="h-6 w-6 animate-spin animation-duration-[1.5s]" />
                                Loading...
                            </div>
                        ) : (
                            <>
                                {data?.customers?.length > 0 ? (
                                    data.customers.map((customer) => (
                                        <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full shrink-0 bg-gray-200 overflow-hidden">
                                                        {customer.avatar?.url ? (
                                                            <img
                                                                src={customer.avatar.url}
                                                                alt={customer.fullname}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                                {customer.fullname?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {customer.fullname}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{customer.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{customer.orders || "0"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                ₹ {customer.balance || "0.00"}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${
                                                        !customer.isBlocked
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {customer.isBlocked ? "Blocked" : "Active"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    className={`relative w-20 h-7 rounded-full flex items-center px-1 transition-colors ${
                                                        customer.isBlocked
                                                            ? "bg-red-600 justify-end"
                                                            : "bg-gray-200 justify-start"
                                                    } ${isPending && "cursor-not-allowed"}`}
                                                    onClick={() => handleToggle(customer)}
                                                    disabled={isPending}
                                                >
                                                    <span
                                                        className={`absolute text-[10px] font-bold ${
                                                            customer.isBlocked
                                                                ? "left-2 text-white"
                                                                : "right-2 text-gray-500"
                                                        }`}
                                                    >
                                                        {customer.isBlocked ? "UNBLOCK" : "BLOCK"}
                                                    </span>
                                                    <div className="w-5 h-5 bg-white rounded-full shadow-sm z-10" />
                                                </button>
                                            </td>

                                            {/* Date Column */}
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                {formatDate(customer.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No customers found.
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                    <span className="text-sm text-gray-500">
                        Showing {totalCustomers === 0 ? 0 : startItem}-{endItem} from {totalCustomers}
                    </span>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (page <= 3) pageNum = i + 1;
                            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = page - 2 + i;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                                        page === pageNum
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages || totalPages === 0}
                            className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerList;