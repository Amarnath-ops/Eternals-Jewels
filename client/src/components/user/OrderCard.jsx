import React, { useState } from "react";
import { orderService } from "@/services/user/order.service";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

const OrderCard = ({ order, onOrderCancelled }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(amount);
    };
    // Helper to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    // Determine status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'text-green-600';
            case 'shipped':
                return 'text-blue-600';
            case 'cancelled':
                return 'text-red-500';
            case 'refunded':
                return 'text-purple-600';
            default: // pending, processing
                return 'text-orange-500';
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        
        try {
            setLoading(true);
            await orderService.cancelOrder(order._id);
            toast.success("Order cancelled successfully");
            if (onOrderCancelled) onOrderCancelled();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Product Images Group */}
            <div className="flex -space-x-4 overflow-hidden">
                {order.orderItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="w-16 h-16 rounded-full border-2 border-white bg-gray-100 shrink-0 overflow-hidden relative z-[3] first:z-[1] last:z-[3]">
                        <img 
                            src={item.image} 
                            alt={item.productName} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                {order.orderItems.length > 3 && (
                    <div className="w-16 h-16 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 z-0">
                        +{order.orderItems.length - 3}
                    </div>
                )}
            </div>
            {/* Order Details */}
            <div className="flex-1 space-y-1">
                <p className="text-gray-900 font-medium">Order Id : {order._id.slice(-10).toUpperCase()}</p>
                <p className="text-gray-600 text-sm">Payable amount : {formatCurrency(order.finalAmount)}</p>
                <p className="text-gray-500 text-sm">Order Date : {formatDate(order.createdAt)}</p>
            </div>
            {/* Status and Actions */}
            <div className="flex flex-col items-end gap-3 min-w-[140px]">
                <p className="text-sm font-medium">
                    Status : <span className={`uppercase ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span>
                </p>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate(`/account/orders/${order._id}`)}
                        className="px-4 py-2 bg-black text-white text-xs uppercase font-medium rounded hover:bg-gray-800 transition-colors">
                        View Details
                    </button>
                    {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && order.orderStatus !== "Returned" && (
                         <button 
                            onClick={handleCancelOrder}
                            disabled={loading}
                            className={`px-4 py-2 bg-red-500 text-white text-xs uppercase font-medium rounded hover:bg-red-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                            {loading ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default OrderCard;