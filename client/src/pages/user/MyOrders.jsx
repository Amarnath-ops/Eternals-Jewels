import React, { useState, useEffect } from "react";
import { useGetOrders } from "@/hooks/tanstack_Queries/user/order/useGetOrders";
import { SpinnerBadge } from "@/components/Spinner";
import OrderCard from "@/components/user/OrderCard";
import Pagination from "@/components/Pagination";
import { Search } from "lucide-react";

const MyOrders = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const limit = 3;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, isError, refetch } = useGetOrders(page, limit, debouncedSearch);

    if (isLoading) return <SpinnerBadge content="Loading Orders..." />;
    
    if (isError) return <div className="text-center py-10 text-red-500">Failed to fetch orders. Please try again later.</div>;

    const orders = data?.orders || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-serif text-[#1c1c1c] mb-8 font-normal">My Orders</h1>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search orders by ID or Product Name..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7e6b58] focus:border-transparent bg-white"
                />
            </div>

            {orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-white rounded-lg p-10 shadow-sm">
                    <p className="text-lg">No orders found.</p>
                </div>
            ) : (
                <div className="flex-1 overflow-auto">
                    {orders.map((order) => (
                        <OrderCard 
                            key={order._id} 
                            order={order} 
                            onOrderCancelled={refetch}
                        />
                    ))}
                </div>
            )}

            {}
            <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
                className="mt-auto pt-6"
            />
        </div>
    );
};

export default MyOrders;
