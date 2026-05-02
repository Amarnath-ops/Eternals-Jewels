import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useGetCartItems } from "@/hooks/tanstack_Queries/user/cart/useGetCartItems";
import { useGetAddress } from "@/hooks/tanstack_Queries/user/address/useAddresses";
import { SpinnerBadge } from "@/components/Spinner";
import { Edit, Plus } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddressModal from "@/components/user/AddressModal";
import { usePlaceOrder } from "@/hooks/tanstack_Queries/user/order/usePlaceOrder";
import useVerifyPayment from "@/hooks/tanstack_Queries/user/order/useVerifyPayment";
import { useGetWallet } from "@/hooks/tanstack_Queries/user/wallet/useGetWallet";
import { useApplyCoupon } from "@/hooks/tanstack_Queries/user/coupon/useApplyCoupon";
import { useGetCoupons } from "@/hooks/tanstack_Queries/user/coupon/useGetCoupons";
import { X } from "lucide-react";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const CheckoutPage = () => {
    const { data: cartData, isLoading: isCartLoading } = useGetCartItems();
    const { data: addressData, isLoading: isAddressLoading } = useGetAddress();
    const { mutateAsync: placeOrder, isPending: isPlacingOrder } = usePlaceOrder();
    const { mutateAsync: verifyPayment } = useVerifyPayment();
    const { data: walletData, isLoading: isWalletLoading } = useGetWallet();
    const { mutateAsync: applyCoupon, isPending: isApplyingCoupon } = useApplyCoupon();
    const { data: couponsData, isLoading: isCouponsLoading } = useGetCoupons();
    const navigate = useNavigate();

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("RazorPay");
    
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [addressToEdit, setAddressToEdit] = useState(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    React.useEffect(() => {
        if (addressData && addressData.length > 0 && !selectedAddressId) {
            const defaultAddr = addressData.find((addr) => addr.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id);
            } else {
                setSelectedAddressId(addressData[0]._id);
            }
        }
    }, [addressData, selectedAddressId]);

    const handleAddAddress = () => {
        setModalMode("add");
        setAddressToEdit(null);
        setIsAddressModalOpen(true);
    };

    const handleEditAddress = (e, addr) => {
        e.stopPropagation();
        setModalMode("edit");
        setAddressToEdit(addr);
        setIsAddressModalOpen(true);
    };

    if (isCartLoading || isAddressLoading || isWalletLoading) {
        return <SpinnerBadge content={"Loading checkout..."} />;
    }

    if (!cartData?.cart?.items || (cartData.cart.items.length === 0 && paymentMethod !== "RazorPay")) {
        toast.error("You don't have any products in your cart to proceed with checkout.");
        return <Navigate to="/cart" />;
    }

    const { items, total } = cartData.cart;
    const deliveryCharge = total < 1000 ? 50 : 0;
    const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const finalTotal = total + deliveryCharge - discountAmount;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7);

    const handleApplyCoupon = async (code) => {
        try {
            const res = await applyCoupon({ code, totalAmount: total });
            if (res.success) {
                setAppliedCoupon({
                    code: res.data.code,
                    discountAmount: res.data.discountAmount
                });
                toast.success("Coupon applied successfully!");
                setIsCouponModalOpen(false);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid coupon");
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        toast.success("Coupon removed");
    };

    const handlePlaceOrderClick = () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address.");
            return;
        }

        if (paymentMethod === "Wallet") {
            const walletBalance = walletData?.wallet?.balance || 0;
            if (walletBalance < finalTotal) {
                toast.error(`Insufficient wallet balance. You need ₹${finalTotal.toFixed(2)} but have ₹${walletBalance.toFixed(2)}.`);
                return;
            }
        }
        
        setIsConfirmModalOpen(true);
    };

    const confirmPlaceOrder = async () => {
        setIsConfirmModalOpen(false);

        try {
            const orderData = {
                addressId: selectedAddressId,
                paymentMethod: paymentMethod,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
            };

            const response = await placeOrder(orderData);

            if (paymentMethod === "RazorPay") {
                const isScriptedLoaded = await loadRazorpayScript();
                if (!isScriptedLoaded) {
                    toast.error("Failed to load Razorpay SDK. Are you online?");
                    return;
                }
                const options = {
                    key: response.key,
                    amount: response.amount,
                    currency: "INR",
                    name: "Eternals Jewels",
                    description: "Jewellery Purchase",
                    order_id: response.razorpayOrderId,
                    handler: async (paymentResponse) => {
                        const verificationData = {
                            orderId: response.orderId,
                            razorpayPaymentId: paymentResponse.razorpay_payment_id,
                            razorpayOrderId: paymentResponse.razorpay_order_id,
                            razorpaySignature: paymentResponse.razorpay_signature,
                        };
                        try {
                            await verifyPayment(verificationData);
                            toast.success("Payment Successful! Order placed.");
                            navigate("/order-success");
                        } catch (error) {
                            toast.error("Payment Verification failed");
                            console.log(error);
                        }
                    },
                    prefill: {
                        name: addressData.find((a) => a._id === selectedAddressId)?.fullname || "Customer",
                        contact: addressData.find((a) => a._id === selectedAddressId)?.phone || "",
                    },
                    theme: {
                        color: "#8B6D51",
                    },
                    modal: {
                        ondismiss: function () {
                            navigate("/payment-failed", {
                                state: { error: "Payment was cancelled.", orderId: response.orderId },
                            });
                        },
                    },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.on("payment.failed", function (failResponse) {
                    toast.error(failResponse.error.description || "Payment failed!");
                    document.body.style.overflow = "auto";
                    try {
                        const razorpayContainer = document.querySelector(".razorpay-container");
                        if (razorpayContainer) {
                            razorpayContainer.style.display = "none";
                            razorpayContainer.remove();
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    navigate("/payment-failed", {
                        state: {
                            error: failResponse.error.description || "Your payment could not be processed at this time.",
                            orderId: response.orderId,
                        },
                    });
                });
                paymentObject.open();
                paymentObject.on("payment.success", () => {
                    document.body.style.overflow = "auto";
                });
                paymentObject.on("modal.closed", () => {
                    document.body.style.overflow = "auto";
                });
            } else {
                toast.success("Order Placed successfully!");
                navigate("/order-success");
            }
        } catch (error) {
            console.error("Order placement failed", error);
            toast.error(error?.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-10 md:py-16">
                <h1 className="sr-only">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Order Summary */}
                    <div className="bg-[#F8F5F2] p-6 md:p-10 rounded-xl h-fit">
                        <h2 className="text-3xl font-serif text-[#1c1c1c] mb-8 font-medium">Order Summary</h2>
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div
                                    key={`${item.productId} - ${item.variantId}`}
                                    className="flex bg-white p-4 rounded-lg shadow-sm"
                                >
                                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="ml-4 grow flex flex-col justify-center">
                                        <h3 className="font-semibold text-gray-900 uppercase tracking-wide text-sm">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">Quantity : {item.quantity}</p>
                                        <p className="text-lg font-medium text-gray-700 mt-1">
                                            ₹{item.salePrice.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Section */}
                        <div className="mt-8 bg-white p-4 rounded-lg shadow-sm border border-gray-100 relative group overflow-hidden">
                            {appliedCoupon ? (
                                <div className="flex bg-[#9E7C62] text-white p-6 rounded-md justify-between items-center transition-all duration-300">
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-lg tracking-wider mb-1">{appliedCoupon.code}</h3>
                                        <p className="text-white/80 text-sm">Coupon applied successfully</p>
                                    </div>
                                    <button 
                                        onClick={handleRemoveCoupon}
                                        className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-black/80 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsCouponModalOpen(true)}
                                    className="w-full bg-[#9E7C62] text-white font-medium py-3 rounded-md uppercase tracking-wide hover:bg-[#8B6D51] transition-colors relative overflow-hidden"
                                >
                                    Apply Coupon
                                </button>
                            )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal :</span>
                                <span className="font-medium">₹ {total.toFixed(2)}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount ({appliedCoupon.code}) :</span>
                                    <span className="font-medium">- ₹ {appliedCoupon.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-700">
                                <span>Delivery charge :</span>
                                <span className="font-medium">{deliveryCharge === 0 ? "Free" : `₹ ${deliveryCharge.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Estimated Delivery :</span>
                                <span className="font-medium text-green-600">
                                    {estimatedDate.toLocaleDateString("en-US", {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-200 mt-4">
                                <span>Total :</span>
                                <span>₹ {finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Delivery & Payment */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                                CHOOSE DELIVERY POINT
                            </h2>
                        </div>

                        {/* Address Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                            {addressData?.map((addr) => (
                                <div
                                    key={addr._id}
                                    onClick={() => setSelectedAddressId(addr._id)}
                                    className={`relative p-6 rounded-lg cursor-pointer transition-all border ${
                                        selectedAddressId === addr._id
                                            ? "bg-[#F4F1EE] border-[#8B6D51] border-opacity-30"
                                            : "bg-gray-50 border-transparent hover:border-gray-200"
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        {addr.isDefault && (
                                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                Default
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => handleEditAddress(e, addr)}
                                            className="p-1 hover:bg-gray-200 rounded-full transition-colors ml-auto"
                                        >
                                            <Edit size={16} className="text-gray-600" />
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{addr.fullname}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {addr.address}
                                        <br />
                                        {addr.city}, {addr.state}
                                        <br />
                                        {addr.pincode}
                                        <br />
                                        {addr.country || "India"}
                                    </p>
                                </div>
                            ))}

                            {/* Add New Address Card */}
                            <button
                                onClick={handleAddAddress}
                                className="flex flex-col items-center justify-center p-6 bg-[#EBEBEB] rounded-lg cursor-pointer hover:bg-gray-200 transition-colors min-h-50"
                            >
                                <span className="font-medium text-gray-700 mb-2">Add new Address</span>
                                <Plus className="text-gray-600" />
                            </button>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-[#F4F1EE] p-8 rounded-xl">
                            <h2 className="text-3xl font-serif text-[#1c1c1c] mb-6 font-normal">Payment Method</h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "RazorPay" ? "border-black" : "border-gray-400"}`}
                                    >
                                        {paymentMethod === "RazorPay" && <div className="w-3 h-3 bg-black rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="RazorPay"
                                        checked={paymentMethod === "RazorPay"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="hidden"
                                    />
                                    <span className="text-gray-800">Razor Pay</span>
                                </label>

                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "COD" ? "border-black" : "border-gray-400"}`}
                                    >
                                        {paymentMethod === "COD" && <div className="w-3 h-3 bg-black rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === "COD"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="hidden"
                                    />
                                    <span className="text-gray-800">Cash on delivery</span>
                                </label>

                                <label className="flex items-center gap-4 cursor-pointer">
                                    <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "Wallet" ? "border-black" : "border-gray-400"}`}
                                    >
                                        {paymentMethod === "Wallet" && <div className="w-3 h-3 bg-black rounded-full" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Wallet"
                                        checked={paymentMethod === "Wallet"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="hidden"
                                    />
                                    <span className="text-gray-800">Wallet (Balance: ₹{walletData?.wallet?.balance?.toFixed(2) || "0.00"})</span>
                                </label>
                            </div>

                            <button
                                onClick={handlePlaceOrderClick}
                                disabled={isPlacingOrder}
                                className={`w-full bg-[#8B6D51] text-white font-medium py-4 mt-8 rounded-md uppercase tracking-wide hover:bg-[#725841] transition-colors shadow-md ${isPlacingOrder ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {isPlacingOrder ? "Placing Order..." : "Place Order"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Address Modal */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                mode={modalMode}
                initialData={addressToEdit}
            />

            {/* Order Confirmation Modal */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-serif text-gray-900 mb-4 font-semibold">Confirm Your Order</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to place this order? 
                            <br/><br/>
                            <span className="font-medium text-gray-800">Payment Method:</span> {paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}
                            <br/>
                            <span className="font-medium text-gray-800">Total Amount:</span> ₹{finalTotal.toFixed(2)}
                        </p>
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPlaceOrder}
                                className="flex-1 py-3 px-4 bg-[#8B6D51] text-white font-medium rounded-lg hover:bg-[#725841] transition-colors shadow-sm"
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Coupons Modal */}
            {isCouponModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
                    <div className="bg-[#FAF7F2] rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200 relative">
                        <button 
                            onClick={() => setIsCouponModalOpen(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <X size={24} />
                        </button>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 mt-4 custom-scrollbar">
                            {isCouponsLoading ? (
                                <div className="flex justify-center p-8 text-gray-500">Loading coupons...</div>
                            ) : couponsData?.data && couponsData.data.length > 0 ? (
                                couponsData.data.map((coupon) => (
                                    <div key={coupon._id} className="bg-[#A47F64] rounded-lg p-5 flex justify-between items-center text-white shadow-md relative overflow-hidden group">
                                        <div className="flex flex-col relative z-10">
                                            <h4 className="font-bold text-xl uppercase tracking-wider mb-1">{coupon.code}</h4>
                                            <p className="text-white/90 text-sm">
                                                {coupon.discountType === 'percentage' 
                                                    ? `${coupon.discountAmount}% off entire order` 
                                                    : `₹${coupon.discountAmount} flat discount`}
                                                {coupon.minPurchaseAmount > 0 && ` • Minimum purchase of ₹${coupon.minPurchaseAmount}`}
                                            </p>
                                            <p className="text-white/70 text-xs mt-2">
                                                expiry date : {new Date(coupon.expiryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end relative z-10 min-w-24">
                                            <button
                                                onClick={() => handleApplyCoupon(coupon.code)}
                                                disabled={isApplyingCoupon || total < coupon.minPurchaseAmount}
                                                className={`bg-white text-[#A47F64] font-bold px-6 py-2 rounded shadow-sm transition-all mb-2 ${
                                                    total < coupon.minPurchaseAmount 
                                                        ? "opacity-50 cursor-not-allowed" 
                                                        : "hover:bg-gray-50"
                                                }`}
                                            >
                                                Apply
                                            </button>
                                            <span className="text-white/90 font-bold tracking-widest uppercase text-sm">{coupon.code}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-8 text-gray-500 font-medium bg-white rounded-lg border border-gray-100 shadow-sm">
                                    No coupons available at the moment.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
