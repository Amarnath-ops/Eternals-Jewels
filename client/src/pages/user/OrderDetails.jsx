import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { SpinnerBadge } from "@/components/Spinner";
import { ArrowLeft, Download, RefreshCcw, XCircle, AlertCircle } from "lucide-react";
import ConfirmModal from "@/components/Modal";
import toast from "react-hot-toast";
import downloadInvoice from "@/lib/downloadInvoice";
import useRetryPayment from "@/hooks/tanstack_Queries/user/order/useRetryPayment";
import useVerifyPayment from "@/hooks/tanstack_Queries/user/order/useVerifyPayment";
import { useGetOrderDetails } from "@/hooks/tanstack_Queries/user/order/useGetOrderDetails";
import { useCancelOrderItem } from "@/hooks/tanstack_Queries/user/order/useCancelOrderItem";
import { useReturnOrderItem } from "@/hooks/tanstack_Queries/user/order/useReturnOrderItem";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    const { data: orderData, isLoading: loading, error, refetch } = useGetOrderDetails(orderId);
    const { mutateAsync: cancelOrderItem } = useCancelOrderItem();
    const { mutateAsync: returnOrderItem } = useReturnOrderItem();
    const { mutateAsync: retryPayment, isPending: isRetrying } = useRetryPayment();
    const { mutateAsync: verifyPayment } = useVerifyPayment();

    const order = orderData?.order;

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [selectedItemForReturn, setSelectedItemForReturn] = useState(null);
    const [returnReason, setReturnReason] = useState("");

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedItemForCancel, setSelectedItemForCancel] = useState(null);

    const returnReasons = [
        "Product damaged",
        "Wrong item received",
        "Item not as described",
        "Size/Fit issue",
        "Changed mind",
        "Other"
    ];

    const handleReturnClick = (item) => {
        setSelectedItemForReturn(item);
        setIsReturnModalOpen(true);
        setReturnReason("");
    };

    const handleConfirmReturn = async () => {
        if (!selectedItemForReturn) return;
        if (!returnReason) {
             toast.error("Please select a reason for return");
             return;
        }
        
        try {
            await returnOrderItem({ 
                orderId: order._id, 
                itemId: selectedItemForReturn._id, 
                reason: returnReason 
            }); 
            setIsReturnModalOpen(false);
        } catch (err) {
            console.log(err)
        }
    };

    const handleCancelItemClick = (item) => {
        setSelectedItemForCancel(item);
        setIsCancelModalOpen(true);
    };

    const confirmCancelItem = async () => {
        if (!selectedItemForCancel) return;

        try {
            await cancelOrderItem({ 
                orderId: order._id, 
                itemId: selectedItemForCancel._id 
            });
            setIsCancelModalOpen(false);
        } catch (err) {
            console.log(err)
        }
    };

    const handleRetryPayment = async () => {
        try {
            const response = await retryPayment(order._id);
            
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                 toast.error("Failed to load Razorpay SDK. Are you online?");
                 return;
            }

            const options = {
                 key: response.key,
                 amount: response.amount,
                 currency: "INR",
                 name: "Eternals Jewels",
                 description: "Jewelry Purchase",
                 order_id: response.razorpayOrderId, 
                 handler: async function (paymentResponse) {
                      const verificationData = {
                           orderId: response.orderId,
                           razorpayPaymentId: paymentResponse.razorpay_payment_id,
                           razorpayOrderId: paymentResponse.razorpay_order_id,
                           razorpaySignature: paymentResponse.razorpay_signature
                      };
                      
                      try {
                           await verifyPayment(verificationData);
                           toast.success("Payment Successful!");
                           refetch();
                      } catch (error) {
                           toast.error("Payment verification failed.");
                           console.log(error)
                      }
                 },
                 prefill: {
                      name: order.shippingAddress?.fullname || "Customer",
                      contact: order.shippingAddress?.phone || ""
                 },
                 theme: { color: "#8B6D51" },
                 modal: {
                      ondismiss: function() {
                           navigate("/payment-failed", { state: { error: "Payment was cancelled.", orderId: order._id } });
                      }
                 }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on("payment.failed", function (res) {
                 toast.error(res.error.description || "Payment failed!");
                 try {
                     const razorpayContainer = document.querySelector(".razorpay-container");
                     if (razorpayContainer) {
                         razorpayContainer.style.display = "none";
                         razorpayContainer.remove();
                     }
                 } catch (e) {
                     console.log(e);
                 }
                 navigate("/payment-failed", { state: { error: res.error.description || "Your payment could not be processed at this time.", orderId: order._id } });
            });
            paymentObject.open();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to initiate payment retry");
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center"><SpinnerBadge content="Loading Order Details..." /></div>;
    if (error) return <div className="h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!order) return <div className="h-screen flex items-center justify-center">Order not found</div>;

    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formatEstimatedDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });

    const steps = ["Order Confirmed", "Shipped", "Out For Delivery", "Delivered"];
    const isCancelled = order.orderStatus === "Cancelled";
    const isReturned = order.orderStatus === "Returned";
    
    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                {}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6">
                    <div>
                        <Link to="/account/orders" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4 text-sm font-medium transition-colors">
                            <ArrowLeft size={16} /> Back to My Orders
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                        <div className="mt-2 flex items-center gap-4 text-gray-500 text-sm">
                            <p className="font-medium text-gray-900 tracking-wide text-lg">Order ID: <span className="font-normal text-gray-600">{order._id.slice(-10).toUpperCase()}</span></p>
                            <span className="hidden md:inline">•</span>
                            <p className="hidden md:block">Order date: {formatDate(order.createdAt)}</p>
                        </div>
                        {order.deliveryDate && !isCancelled && !isReturned && (
                             <p className="mt-1 text-green-600 font-medium text-sm flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Estimated delivery: {formatEstimatedDate(order.deliveryDate)}
                             </p>
                        )}
                         {(isCancelled || isReturned) && (
                             <p className={`mt-1 font-medium text-sm ${isCancelled ? 'text-red-500' : 'text-purple-500'}`}>
                                 Order Status: {order.orderStatus}
                             </p>
                         )}
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        {order.orderStatus === "Delivered" && (
                            <button 
                                onClick={() => downloadInvoice(order)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors group"
                            >
                                <Download size={16} className="text-gray-500 group-hover:text-gray-900"/> Invoice
                            </button>
                        )}
                    </div>
                </div>

                {}
                {!isCancelled && !isReturned && (
                    <div className="mb-12 relative px-4 mt-8">
                        {}
                        <div className="hidden md:block absolute top-12.5 left-[12.5%] w-[75%] h-1 bg-gray-200 -z-10"></div>
                        
                        {}
                        <div 
                            className="hidden md:block absolute top-12.5 left-[12.5%] h-1 bg-blue-600 transition-all duration-500 z-0"  
                            style={{ 
                                width: `${(Math.max(0, (() => {
                                    const statusMap = {
                                        'pending': 0,
                                        'processing': 0.5,
                                        'shipped': 1,
                                        'out for delivery': 2,
                                        'delivered': 3
                                    };
                                    let idx = statusMap[order.orderStatus.toLowerCase()] || 0;
                                    if (order.orderStatus === 'Delivered') idx = 3;
                                    return (idx / 3) * 75; 
                                })()) )}%` 
                            }}
                        ></div>

                        <div className="hidden md:flex justify-between items-start relative z-10 w-full">
                            {steps.map((step, index) => {
                                let statusIndex = 0;
                                const s = order.orderStatus.toLowerCase();
                                if (s === 'processing') statusIndex = 0; // Still confirmed
                                else if (s === 'shipped') statusIndex = 1;
                                else if (s === 'delivered') statusIndex = 3;
                                else statusIndex = 0; // Pending default
                                
                                const isCompleted = index <= statusIndex;

                                let statusColor = "text-gray-400";
                                let circleColor = "bg-gray-200 border-gray-200 text-gray-400";
                                
                                if (isCompleted) {
                                     statusColor = "text-blue-600 font-semibold";
                                     circleColor = "bg-blue-600 border-blue-600 text-white";
                                }

                                return (
                                    <div key={index} className="flex flex-col items-center flex-1">
                                        <p className={`mb-3 text-sm font-medium ${statusColor} h-6 flex items-center`}>{step}</p>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-20 transition-all duration-300 ${circleColor}`}>
                                            {isCompleted ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {}
                <div className="mb-8">
                    {order.orderItems.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-6 py-6 border-b last:border-0 border-gray-100">
                             <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                                {(() => {
                                    const variant = item.product?.variants?.find(v => v._id === item.variantId);
                                    return variant ? <p className="text-sm text-gray-500 mb-2">{variant.material}</p> : null;
                                })()}
                                <p className="text-sm font-medium text-orange-500">Status : {item.itemStatus || order.orderStatus}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                                <p className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</p>
                                {item.regularPrice > item.price && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-400 line-through">{formatCurrency(item.regularPrice)}</p>
                                        {item.regularPrice > item.price && (
                                            <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold border border-green-100 uppercase">
                                                {Math.round(((item.regularPrice - item.price) / item.regularPrice) * 100)}% Offer
                                            </span>
                                        )}
                                    </div>
                                )}
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                {item.itemStatus === "Delivered" && (
                                    <button 
                                        onClick={() => handleReturnClick(item)}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <RefreshCcw size={14} /> Return
                                    </button>
                                )}
                                {item.itemStatus === "Return Requested" && (
                                     <span className="text-sm text-orange-500 font-medium">Return Requested</span>
                                )}
                                {["Pending", "Processing"].includes(item.itemStatus || order.orderStatus) && (
                                    <button 
                                        onClick={() => handleCancelItemClick(item)}
                                        className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <XCircle size={14} /> Cancel Item
                                    </button>
                                )}
                                {item.itemStatus === "Cancelled" && (
                                     <span className="text-sm text-red-500 font-medium">Cancelled</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-8 mt-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600 font-medium">Method</span>
                                        <span className="text-gray-900 font-semibold">{order.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Status</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            order.paymentStatus === 'Completed' || order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' :
                                            order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700 border-red-200' :
                                            order.paymentStatus === 'Refunded' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                            'bg-amber-100 text-amber-700 border-amber-200'
                                        }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    {order.paymentMethod === 'RazorPay' && (order.paymentStatus === 'Pending' || order.paymentStatus === 'Failed') && !isCancelled && !isReturned && (
                                        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                                            <button 
                                                onClick={handleRetryPayment}
                                                disabled={isRetrying}
                                                className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                                            >
                                                {isRetrying ? <RefreshCcw className="w-4 h-4 animate-spin" /> : null}
                                                Retry Payment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery</h3>
                                <div className="text-gray-600 text-sm leading-relaxed">
                                    <p className="font-medium text-gray-800 mb-1">Address</p>
                                    <p>{order.shippingAddress.address}</p>
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.pincode}</p>
                                    <p>{order.shippingAddress.phone}</p>
                                </div>
                            </div>
                        </div>

                        {}
                        <div>
                             <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                             <div className="space-y-3 text-sm">
                                 <div className="flex justify-between text-gray-600">
                                     <span>Subtotal</span>
                                     <span className="font-medium text-gray-900">{formatCurrency(order.totalAmount)}</span>
                                 </div>
                                 <div className="flex justify-between text-gray-600">
                                     <span>Discount</span>
                                     <span className="font-medium text-red-500">-{formatCurrency(order.discountAmount || 0)}</span>
                                 </div>
                                 <div className="flex justify-between text-gray-600">
                                     <span>Delivery Fee</span>
                                     <span className="font-medium text-green-600">{order.finalAmount - order.totalAmount > 0 ? formatCurrency(order.finalAmount - order.totalAmount) : "Free"}</span>
                                 </div>
                                 <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                                     <span className="text-base font-bold text-gray-900">Total</span>
                                     <span className="text-xl font-bold text-gray-900">{formatCurrency(order.finalAmount)}</span>
                                 </div>
                             </div>
                        </div>
                     </div>
                </div>
            </div>

            {}
            {isReturnModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all scale-100 opacity-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Request Return</h3>
                            <button onClick={() => setIsReturnModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 p-1.5 rounded-full hover:bg-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600 text-sm mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                You are requesting a return for <span className="font-semibold text-blue-900">{selectedItemForReturn?.productName}</span>.
                            </p>
                            
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Return</label>
                            <div className="relative">
                                <select 
                                    className="w-full appearance-none border border-gray-300 rounded-lg py-2.5 px-4 pr-10 focus:ring-2 focus:ring-black focus:border-black outline-none transition-shadow bg-white text-gray-700 font-medium"
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                >
                                    <option value="" disabled>Select a reason...</option>
                                    {returnReasons.map((reason) => (
                                        <option key={reason} value={reason}>{reason}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                onClick={() => setIsReturnModalOpen(false)}
                                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmReturn}
                                className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 hover:shadow-lg transform active:scale-95 transition-all text-sm font-medium"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal open={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)}>
                <div className="w-full max-w-sm p-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-50 p-3 rounded-full">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Item?</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to cancel {selectedItemForCancel?.productName}? This action cannot be undone.
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
                            onClick={confirmCancelItem}
                        >
                            Yes, cancel item
                        </button>
                    </div>
                </div>
            </ConfirmModal>

        </div>
    );
};

export default OrderDetails;
