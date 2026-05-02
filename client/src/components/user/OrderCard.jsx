import { useCancelOrder } from "@/hooks/tanstack_Queries/user/order/useCancelOrder";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "@/components/Modal";
import { AlertCircle } from "lucide-react";

const OrderCard = ({ order, onOrderCancelled }) => {
    const navigate = useNavigate();
    const { mutateAsync: cancelOrder, isPending: loading } = useCancelOrder();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(amount);
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
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
            default: 
                return 'text-orange-500';
        }
    };

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const handleCancelOrderClick = () => {
        setIsCancelModalOpen(true);
    };

    const confirmCancelOrder = async () => {
        try {
            await cancelOrder(order._id);
            if (onOrderCancelled) onOrderCancelled();
            setIsCancelModalOpen(false);
        } catch (error) {
            // Error handled in hook
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {}
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
            {}
            <div className="flex-1 space-y-1">
                <p className="text-gray-900 font-medium">Order Id : {order._id.slice(-10).toUpperCase()}</p>
                <p className="text-gray-600 text-sm">Payable amount : {formatCurrency(order.finalAmount)}</p>
                <p className="text-gray-500 text-sm">Order Date : {formatDate(order.createdAt)}</p>
            </div>
            {}
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
                    {(order.orderStatus === "Pending" || order.orderStatus === "Processing") && (
                         <button 
                            onClick={handleCancelOrderClick}
                            disabled={loading}
                            className={`px-4 py-2 bg-red-500 text-white text-xs uppercase font-medium rounded hover:bg-red-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                         >
                            {loading ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                    )}
                </div>
            </div>

            <ConfirmModal open={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)}>
                <div className="w-full max-w-sm p-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-50 p-3 rounded-full">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button 
                            className="flex-1 py-2.5 px-4 font-medium rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" 
                            onClick={() => setIsCancelModalOpen(false)}
                        >
                            No, keep it
                        </button>
                        <button 
                            className="flex-1 py-2.5 px-4 font-medium rounded-xl bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-colors" 
                            onClick={confirmCancelOrder}
                            disabled={loading}
                        >
                            {loading ? 'Cancelling...' : 'Yes, cancel'}
                        </button>
                    </div>
                </div>
            </ConfirmModal>

        </div>
    );
};
export default OrderCard;