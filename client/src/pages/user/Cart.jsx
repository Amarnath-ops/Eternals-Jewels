import React from "react";
import { ShoppingBag, Minus, Plus, Instagram, Twitter, Facebook, Youtube, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useGetCartItems } from "@/hooks/tanstack_Queries/user/cart/useGetCartItems";
import { SpinnerBadge } from "@/components/Spinner";
import { useUpdateCartQuantity } from "@/hooks/tanstack_Queries/user/cart/useUpdateCartQuantity";
import { useRemoveFromCart } from "@/hooks/tanstack_Queries/user/cart/useRemoveFromCart";
import { useClearCart } from "@/hooks/tanstack_Queries/user/cart/useClearCart";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const CartPage = () => {
    const { data, isLoading } = useGetCartItems();
    const getUnavailableMessage = (item) => {
        if (!item.isActive) return 'Currently Unavailable';
        if (item.stock === 0) return 'Out of Stock';
        if (item.quantity > item.stock) return `Only ${item.stock} left in stock`;
        return null;
    };

    const hasUnavailableItems = data?.cart?.items?.some(item => getUnavailableMessage(item) !== null);
    const { mutateAsync: updateQuantity } = useUpdateCartQuantity();
    const { mutateAsync: removeFromCart } = useRemoveFromCart();
    const { mutateAsync: clearCart } = useClearCart();
    const handleRemoveFromCart = async (item) => {
        const data = {
            productId: item.productId,
            variantId: item.variantId,
        };
        await removeFromCart(data);
    };
    const handleUpdateQuantity = async (item, newQty) => {
        const data = {
            productId: item.productId,
            variantId: item.variantId,
        };
        if (newQty === 0) {
            await removeFromCart(data);
        } else {
            if (newQty > 5) {
                toast.error("Maximum 5 units per item allowed");
                return;
            }
            if (newQty > item.stock) {
                 toast.error(`Only ${item.stock} unit(s) available in stock`);
                 return;
            }
            await updateQuantity({ ...data, quantity: newQty });
        }
    };
    const HandleClearCart = async () => {
        await clearCart();
    };
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <Navbar />

            {}
            {isLoading ? (
                <SpinnerBadge content={"Cart is loading..."} />
            ) : data.cart.total === 0 ? (
                <>
                    <div className="flex justify-center items-center mt-18">
                        <p className="text-2xl font-semibold">Your Cart is Empty.</p>
                    </div>
                </>
            ) : (
                <main className="max-w-6xl mx-auto px-4 py-12">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="text-gray-600" />
                            <h2 className="text-2xl  text-gray-700 font-cormorant">Your shopping Cart</h2>
                        </div>
                        <button
                            className="border border-red-200 text-red-400 px-4 py-2 text-sm hover:bg-red-400 hover:text-white transition"
                            onClick={() => HandleClearCart()}
                        >
                            Empty my cart
                        </button>
                    </div>

                    {}
                    <div className="space-y-4">
                        {data?.cart?.items?.map((item) => {
                            const unavailableMsg = getUnavailableMessage(item);
                            const isUnavailable = !!unavailableMsg;
                            return (
                            <div key={item.productId} className={`flex bg-[#F8F5F2] p-6 relative ${isUnavailable ? 'opacity-70' : ''}`}>
                                <img src={item.image} alt={item.name} className={`w-32 h-32 object-cover bg-white ${isUnavailable ? 'grayscale' : ''}`} />
                                <div className="ml-6 grow">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold text-sm tracking-widest uppercase ${isUnavailable ? 'text-gray-500' : ''}`}>{item.name}</h3>
                                        {isUnavailable && (
                                            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                                                {unavailableMsg}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{item.material}</p>

                                    <div className="mt-8 flex items-baseline gap-2">
                                        <span className="text-xs text-gray-400 line-through">
                                            ₹{item.regularPrice.toFixed(2)}
                                        </span>
                                        <span className="text-xl font-medium text-gray-600">
                                            ₹{item.salePrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between items-end">
                                    <div className="flex border border-gray-300">
                                        <button
                                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                            className="p-2 hover:bg-gray-200"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-6 py-2 bg-gray-100 flex items-center font-karla">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                            className={`p-2 ${item.quantity >= 5 || item.quantity >= item.stock || !item.isActive ? "bg-gray-400 cursor-not-allowed" : "bg-[#C4A484]" } text-white`}
                                            disabled={item.quantity >= 5 || item.quantity >= item.stock || !item.isActive}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                    <button
                                        className="border border-red-200 text-red-400 px-4 py-1 text-xs mt-4 hover:bg-red-400 hover:text-white"
                                        onClick={() => handleRemoveFromCart(item)}
                                    >
                                        Remove from cart
                                    </button>
                                </div>
                            </div>
                        )})}
                    </div>

                    {}
                    <div className="mt-8">
                        <div className="flex justify-between items-center border-t-2 border-gray-800 pt-4">
                            <span className="font-bold tracking-widest font-poppins uppercase">TOTAL AMOUNT</span>
                            <span className="text-2xl font-semibold font-karla">₹{data?.cart?.total?.toFixed(2)}</span>
                        </div>
                        <p className="text-center text-xs text-gray-500 my-6">
                            Shipping, taxes, and discount codes calculated at checkout.
                        </p>

                        <div className="space-y-3">
                            {hasUnavailableItems ? (
                                <button 
                                    onClick={() => toast.error("Please remove out of stock or unavailable items to proceed.")}
                                    className="w-full bg-gray-400 text-gray-200 py-4 uppercase tracking-widest font-medium cursor-not-allowed transition mb-2"
                                >
                                    Proceed to Checkout
                                </button>
                            ) : (
                                <Link to="/checkout">
                                    <button className="w-full bg-[#B69981] text-white py-4 uppercase tracking-widest font-medium hover:bg-[#a38870] transition mb-2">
                                        Proceed to Checkout
                                    </button>
                                </Link>
                            )}
                            <Link to="/shop">
                                <button className="w-full bg-[#B69981] text-white py-4 uppercase tracking-widest font-medium hover:bg-[#a38870] transition">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
};

export default CartPage;
