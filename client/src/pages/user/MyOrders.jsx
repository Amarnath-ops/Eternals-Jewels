import React, { useState } from "react";
import { useGetOrders } from "@/hooks/tanstack_Queries/user/order/useGetOrders";
import { SpinnerBadge } from "@/components/Spinner";
import OrderCard from "@/components/user/OrderCard";
import Pagination from "@/components/Pagination";

const MyOrders = () => {
    const [page, setPage] = useState(1);
    const limit = 3;
    const { data, isLoading, isError, refetch } = useGetOrders(page, limit);

    if (isLoading) return <SpinnerBadge content="Loading Orders..." />;
    
    if (isError) return <div className="text-center py-10 text-red-500">Failed to fetch orders. Please try again later.</div>;

    const orders = data?.orders || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-serif text-[#1c1c1c] mb-8 font-normal">My Orders</h1>

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

            {/* Pagination */}
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
