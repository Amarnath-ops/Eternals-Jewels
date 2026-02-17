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

const CheckoutPage = () => {
    const { data: cartData, isLoading: isCartLoading } = useGetCartItems();
    const { data: addressData, isLoading: isAddressLoading } = useGetAddress();
    const { mutateAsync: placeOrder, isPending: isPlacingOrder } = usePlaceOrder();
    const navigate = useNavigate();

    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("RazorPay");

    // Address Modal State
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [addressToEdit, setAddressToEdit] = useState(null);

    // Set default address as selected initially if available
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
        e.stopPropagation(); // Prevent selecting the address card when clicking edit
        setModalMode("edit");
        setAddressToEdit(addr);
        setIsAddressModalOpen(true);
    };

    if (isCartLoading || isAddressLoading) {
        return <SpinnerBadge content={"Loading checkout..."} />;
    }

    if (!cartData?.cart?.items || cartData.cart.items.length === 0) {
        toast.error("You don't have any products in your cart to proceed with checkout.");
        return <Navigate to="/cart" />;
    }

    const { items, total } = cartData.cart;
    const deliveryCharge = total < 1000 ? 50 : 0;
    const finalTotal = total + deliveryCharge;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7);

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a delivery address.");
            return;
        }

        try {
            const orderData = {
                addressId: selectedAddressId,
                paymentMethod: paymentMethod,
            };

            await placeOrder(orderData);
            toast.success("Order placed successfully!");
            navigate("/order-success");
        } catch (error) {
            console.error("Order placement failed", error);
            // Toast is handled by hook onError if configured there, or here.
            // In hook I removed explicit toast.error, so it relies on default or nothing.
            // Let's rely on the error thrown.
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
                        <div className="mt-8">
                            <button className="w-full bg-[#8B6D51] text-white font-medium py-3 rounded-md uppercase tracking-wide hover:bg-[#725841] transition-colors shadow-md">
                                Apply Coupon
                            </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal :</span>
                                <span className="font-medium">₹ {total}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Delivery charge :</span>
                                <span className="font-medium">{deliveryCharge === 0 ? "Free" : `₹ ${deliveryCharge}`}</span>
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
                                <span>₹ {finalTotal}</span>
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
                                className="flex flex-col items-center justify-center p-6 bg-[#EBEBEB] rounded-lg cursor-pointer hover:bg-gray-200 transition-colors min-h-[200px]"
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
                                    <span className="text-gray-800">Wallet</span>
                                </label>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
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
        </div>
    );
};

export default CheckoutPage;
