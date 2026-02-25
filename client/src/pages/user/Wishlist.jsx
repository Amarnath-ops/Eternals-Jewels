import React from "react";
import Navbar from "@/components/Navbar";
import { Heart, Star, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useGetWishlist";
import { useRemoveFromWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useRemoveFromWishlist";
import { useMoveToCart } from "@/hooks/tanstack_Queries/user/wishlist/useMoveToCart"; 
import { useClearWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useClearWishlist";
import { SpinnerBadge } from "@/components/Spinner";

const Wishlist = () => {
    const { data, isLoading } = useGetWishlist();
    const { mutateAsync: removeItem } = useRemoveFromWishlist();
    const { mutateAsync: moveToCart } = useMoveToCart();
    const { mutateAsync: clearWishlist } = useClearWishlist();
    
    const wishlistItems = data?.wishlist?.items || [];

    const handleRemove = async (productId, variantId) => {
        await removeItem({ productId, variantId });
    };

    const handleMoveToCart = async (productId, variantId) => {
        await moveToCart({ productId, variantId });
    };

    const handleClearWishlist = async () => {
        if (window.confirm("Are you sure you want to empty your wishlist?")) {
            await clearWishlist();
        }
    };
    


    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#EAE5DF]">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <SpinnerBadge content="Loading Wishlist..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#EAE5DF] font-sans pb-20">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
                
                {}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-white/50">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <Heart className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                        <h1 className="text-2xl md:text-3xl font-cormorant text-gray-900 tracking-wide">My Wishlist</h1>
                    </div>
                    
                    {wishlistItems.length > 0 && (
                        <button 
                            onClick={handleClearWishlist}
                            className="bg-[#EAE5DF] border border-red-300 text-red-500 hover:bg-red-50 px-6 py-2 rounded-sm text-sm font-medium uppercase tracking-wider transition-colors"
                        >
                            Empty my wishlist
                        </button>
                    )}
                </div>

                {}
                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" strokeWidth={1} />
                        <h2 className="text-xl text-gray-600 font-medium mb-4">Your wishlist is empty</h2>
                        <Link 
                            to="/shop" 
                            className="inline-block bg-[#CAB49E] text-white px-8 py-3 rounded-sm font-medium uppercase tracking-wide hover:bg-[#bfa38a] transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {wishlistItems.map((item) => (
                                <div key={item._id} className="bg-[#F6F1EC] p-4 rounded-sm shadow-sm flex flex-col h-full group">
                                    {}
                                    <div className="relative aspect-[3/4] bg-white w-full overflow-hidden rounded-sm mb-4">
                                        <img 
                                            src={item.image} 
                                            alt={item.productName} 
                                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {}
                                        <Link to={`/product/${item.productId}`} className="absolute inset-0" />
                                    </div>

                                    {}
                                    <div className="flex-1 flex flex-col text-center">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-1 truncate">
                                            <Link to={`/product/${item.productId}`}>{item.productName}</Link>
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">{item.category}</p>
                                        
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {new Intl.NumberFormat('en-IN', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                    maximumFractionDigits: 0,
                                                }).format(item.price)}
                                            </span>
                                            {item.stock === 0 && (
                                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                                    Out of Stock
                                                </span>
                                            )}
                                            <div className="flex text-[#F5B843]">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} fill="currentColor" strokeWidth={0} />
                                                ))}
                                            </div>
                                        </div>

                                        {}
                                        <div className="mt-auto space-y-3 pt-2">
                                            <button 
                                                onClick={() => handleRemove(item.productId, item.variantId)}
                                                className="w-full border border-red-300 text-red-500 text-xs font-bold uppercase tracking-widest py-2.5 rounded-sm hover:bg-red-50 transition-colors"
                                            >
                                                Remove from wishlist
                                            </button>
                                            <button 
                                                onClick={() => handleMoveToCart(item.productId, item.variantId)}
                                                disabled={item.stock === 0}
                                                className={`w-full border border-[#CAB49E] text-xs font-bold uppercase tracking-widest py-2.5 rounded-sm transition-colors ${
                                                    item.stock === 0
                                                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                                        : "text-[#6D5D4E] hover:bg-[#EAE5DF]"
                                                }`}
                                            >
                                                Move to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
