import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetOrderById, useUpdateOrderStatus, useUpdateOrderItemStatus } from "@/hooks/tanstack_Queries/admin/order/useOrderDetails";
import { SpinnerBadge } from "@/components/Spinner";
import { Calendar, CreditCard, Mail, Phone, MapPin, Package, Truck, CheckCircle, Clock, Check, X } from "lucide-react";

const OrderDetails = () => {
    const { orderId } = useParams();
    const { data: orderData, isLoading, isError, error } = useGetOrderById(orderId);
    const { mutate: updateOrderStatus } = useUpdateOrderStatus();
    const { mutate: updateItemStatus } = useUpdateOrderItemStatus();

    const order = orderData?.data;

    const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
    const ITEM_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Return Requested"];

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

    const handleGlobalStatusChange = (e) => {
        updateOrderStatus({ orderId, status: e.target.value });
    };

    const handleItemStatusChange = (itemId, e) => {
        updateItemStatus({ orderId, itemId, status: e.target.value });
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><SpinnerBadge content="Loading Details..." /></div>;
    if (isError) return <div className="text-center py-10 text-red-500">Failed to fetch order details: {error?.response?.data?.message || error?.message}</div>;
    if (!order) return <div className="text-center py-10 text-gray-500">Order not found.</div>;

    const timelineSteps = [
        { status: "Pending", label: "Order Placed", icon: Package, date: order.createdAt },
        { status: "Processing", label: "Processing", icon: Clock },
        { status: "Shipped", label: "Out for Delivery", icon: Truck },
        { status: "Delivered", label: "Delivered", icon: CheckCircle, date: order.deliveryDate },
    ];
    
    const currentStatusIndex = ORDER_STATUSES.indexOf(order.orderStatus);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                <nav className="text-sm text-gray-500 mt-1">
                    <span>Dashboard</span> <span className="mx-1">&gt;</span> 
                    <Link to="/admin/orders" className="hover:text-gray-800 text-gray-500">Order List</Link> <span className="mx-1">&gt;</span> 
                    <span className="text-gray-800 font-medium">Order Details</span>
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {}
                <div className="lg:col-span-2 space-y-6">
                    {}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Order {order._id.slice(-6).toUpperCase()}</h3>
                                    <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <Calendar size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Added</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <CreditCard size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Payment Method</p>
                                        <p className="text-sm font-medium text-gray-800">{order.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Customer</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <span className="text-xs font-bold">{order.user?.fullname?.[0] || "U"}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Customer</p>
                                        <p className="text-sm font-medium text-gray-800">{order.user?.fullname || "Unknown"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <Mail size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-800 truncate w-32" title={order.user?.email}>{order.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <Phone size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm font-medium text-gray-800">{order.shippingAddress?.phone || order.user?.phone || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Address</h3>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                    <MapPin size={14} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">deliver to</p>
                                    <p className="text-sm font-medium text-gray-800 mt-1 leading-relaxed">
                                        {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.pincode}, {order.shippingAddress?.state}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-medium text-gray-800">Order List <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full ml-2">{order.orderItems.length} Products</span></h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-3 font-medium">Product</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">QTY</th>
                                        <th className="px-6 py-3 font-medium">Price</th>
                                        <th className="px-6 py-3 font-medium text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {order.orderItems.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                                                            {item.image ? (
                                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200" />
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{item.productName}</span>
                                                    </div>
                                                    {item.itemStatus === "Return Requested" && (
                                                        <div className="bg-orange-50 text-orange-800 text-xs p-2 rounded border border-orange-100 mt-1">
                                                            <span className="font-bold">Return Reason:</span> {item.returnReason || "No reason provided"}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.itemStatus === "Return Requested" ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-800">
                                                            Return Requested
                                                        </span>
                                                        <button 
                                                            onClick={() => handleItemStatusChange(item._id, { target: { value: "Returned" } })}
                                                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                                            title="Approve Return"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleItemStatusChange(item._id, { target: { value: "Delivered" } })}
                                                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                            title="Reject Return (Move to Delivered)"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <select 
                                                        value={item.itemStatus}
                                                        onChange={(e) => handleItemStatusChange(item._id, e)}
                                                        className={`text-xs font-medium px-2 py-1 rounded border-none focus:ring-1 focus:ring-gray-300 cursor-pointer ${getStatusColor(item.itemStatus)}`}
                                                    >
                                                        {ITEM_STATUSES.filter(status => {
                                                            const currentIndex = ITEM_STATUSES.indexOf(item.itemStatus);
                                                            const statusIndex = ITEM_STATUSES.indexOf(status);

                                                            if (status === "Return Requested") return false;
                                                            
                                                            if (status === "Returned" && item.itemStatus !== "Returned") return false;

                                                            if (item.itemStatus === "Cancelled") return status === "Cancelled";
                                                            if (item.itemStatus === "Returned") return status === "Returned";
                                                            
                                                            if (item.itemStatus === "Delivered") return status === "Delivered";
    
                                                            if (item.itemStatus === "Shipped") {
                                                                return status === "Shipped" || status === "Delivered";
                                                            }
    
                                                            return statusIndex >= currentIndex || status === "Cancelled";
                                                        }).map(status => (
                                                            <option key={status} value={status}>{status}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{item.quantity} pcs</td>
                                            <td className="px-6 py-4 text-gray-600">₹ {item.price}</td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">₹ {item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-5 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-end">
                                <div className="w-full max-w-xs space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium">₹ {order.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">delivery charge</span>
                                        <span className="font-medium">₹ {order.finalAmount - order.totalAmount + (order.discountAmount || 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Discount</span>
                                        <span className="font-medium text-red-500">- ₹ {order.discountAmount || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                                        <span>Grand Total</span>
                                        <span>₹ {order.finalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status Timeline & Global Status */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-medium text-gray-800 mb-6">Order Status</h3>
                        
                        {/* Global Status Selector */}
                         <div className="mb-6">
                            <label className="block text-xs text-gray-500 mb-1">Change Order Status</label>
                            <select 
                                value={order.orderStatus}
                                onChange={handleGlobalStatusChange}
                                className="w-full text-sm border-gray-200 rounded-lg focus:ring-black focus:border-black"
                            >
                                {ORDER_STATUSES.filter(status => {
                                    const currentIndex = ORDER_STATUSES.indexOf(order.orderStatus);
                                    const statusIndex = ORDER_STATUSES.indexOf(status);
                                    
                                    if (status === "Returned" && order.orderStatus !== "Returned") return false;
                                    
                                    if (order.orderStatus === "Cancelled") return status === "Cancelled";
                                    if (order.orderStatus === "Returned") return status === "Returned";

                                    if (order.orderStatus === "Delivered") return status === "Delivered" || status === "Returned";

                                    return statusIndex >= currentIndex || (status === "Cancelled" && order.orderStatus !== "Delivered" && order.orderStatus !== "Shipped"); 
                                }).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {}
                        <div className="space-y-6 relative pl-2">
                            {}
                            <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-gray-100" />
                            
                            {timelineSteps.map((step) => {
                                const stepIndex = ORDER_STATUSES.indexOf(step.status);
                                const isCompleted = currentStatusIndex >= stepIndex;
                                const isCurrent = order.orderStatus === step.status;
                                
                                return (
                                    <div key={step.status} className="relative flex items-start gap-4">
                                        <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                                            isCompleted 
                                            ? "bg-indigo-50 border-indigo-500 text-indigo-600" 
                                            : "bg-white border-gray-200 text-gray-300"
                                        }`}>
                                            <step.icon size={12} />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                                {step.label}
                                            </p>
                                            {step.date && isCompleted && (
                                                 <p className="text-xs text-gray-400 mt-0.5">
                                                    {new Date(step.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                 </p>
                                            )}
                                            {isCurrent && (
                                                <p className="text-xs text-indigo-500 mt-0.5">{order.orderStatus === "Delivered" ? "Delivered at " + new Date(order.updatedAt).toLocaleDateString() : (order.orderStatus === "Cancelled" ? "Cancelled" : (order.orderStatus === "Returned" ? "Returned" : "In Progress"))}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
