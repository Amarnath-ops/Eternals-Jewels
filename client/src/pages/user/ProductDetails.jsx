import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Star, Minus, Plus } from "lucide-react";
import SideBySideMagnifier from "@/components/user/SideBySideMagnifier";
import { useGetUserProductById } from "@/hooks/tanstack_Queries/user/products/useGetUserProductById";
import { useGetProducts } from "@/hooks/tanstack_Queries/user/products/useGetProducts";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/user/ProductCard";
import { SpinnerBadge } from "@/components/Spinner";
import { useAddToCart } from "@/hooks/tanstack_Queries/user/cart/useAddToCart";
import { useSelector } from "react-redux";
import { useGetCartItems } from "@/hooks/tanstack_Queries/user/cart/useGetCartItems";
import { useUpdateCartQuantity } from "@/hooks/tanstack_Queries/user/cart/useUpdateCartQuantity";
import { useRemoveFromCart } from "@/hooks/tanstack_Queries/user/cart/useRemoveFromCart";
import { useAddToWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useAddToWishlist";
import { useGetWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useGetWishlist";
import { useRemoveFromWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useRemoveFromWishlist";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const { data: product, isLoading, isError } = useGetUserProductById(id);

    const { data: relatedData } = useGetProducts({
        category: product?.category?._id,
        limit: 4,
        sort: "-createdAt",
    });

    const { mutateAsync: addtoCart } = useAddToCart();
    const isLogin = useSelector((state) => state.user.isLogin);
    const { data: cartData } = useGetCartItems({ enabled: !!isLogin });
    const { mutateAsync: updateQuantity } = useUpdateCartQuantity();
    const { mutateAsync: removeFromCart } = useRemoveFromCart();

    const { mutateAsync: addToWishlist } = useAddToWishlist();
    const { mutateAsync: removeFromWishlist } = useRemoveFromWishlist();
    const { data: wishlistData } = useGetWishlist({ enabled: !!isLogin });

    const cartItem = cartData?.cart?.items?.find(
        (item) => item.productId === product?._id && item.variantId === selectedMaterial?._id
    );
    const isInWishlist = wishlistData?.wishlist?.items?.some(
        (item) => item.productId === product?._id && item.variantId === selectedMaterial?._id
    );

    const handleQuantityChange = async (newQty) => {
        if (!selectedMaterial) return;

        const data = {
            productId: product._id,
            variantId: selectedMaterial._id,
        };

        if (newQty === 0) {
            await removeFromCart(data);
        } else {
            await updateQuantity({ ...data, quantity: newQty });
        }
    };

    const relatedProducts = relatedData?.products?.filter((p) => p._id !== id).slice(0, 4) || [];

    useEffect(() => {
        if (product) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (product.thumbnail) setActiveImage(product.thumbnail.image_url);

            if (product.variants && product.variants.length > 0) {
                const firstVariant = product.variants[0];
                setSelectedMaterial(firstVariant);
                if (firstVariant.images && firstVariant.images.length > 0) {
                    setActiveImage(firstVariant.images[0].image_url);
                }
            }
        }
    }, [product]);

    useEffect(() => {
        if (selectedMaterial && selectedMaterial.images && selectedMaterial.images.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveImage(selectedMaterial.images[0].image_url);
        } else if (product?.thumbnail) {
            setActiveImage(product.thumbnail.image_url);
        }
    }, [selectedMaterial, product]);

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col bg-[#EAE5DF]">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <SpinnerBadge content="Loading Details..." />
                </div>
            </div>
        );
    }

    if (isError || !product) {
        return (
            <div className="h-screen flex flex-col bg-[#EAE5DF] text-gray-800">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                    <button onClick={() => navigate("/shop")} className="underline">
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const salePrice = selectedMaterial?.salePrice || 0;
    const regularPrice = selectedMaterial?.regularPrice || 0;
    const hasDiscount = regularPrice > salePrice;
    const discountPercentage = hasDiscount ? Math.round(((regularPrice - salePrice) / regularPrice) * 100) : 0;

    const formattedSalePrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(salePrice);

    const formattedRegularPrice = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(regularPrice);
    
    const handleAddToCart = async (product) => {
        const data = {
            productId: product._id,
            variantId: selectedMaterial._id,
            quantity: 1
        };
        await addtoCart(data);
    };

    const handleWishlistToggle = async () => {
        if (!isLogin) {
            navigate("/login");
            return;
        }
        if (!selectedMaterial) return;

        const data = {
            productId: product._id,
            variantId: selectedMaterial._id,
        };

        if (isInWishlist) {
            await removeFromWishlist(data);
        } else {
            await addToWishlist(data);
        }
    };

    return (
        <>
            <Navbar />
            <div className=" min-h-screen pt-12 pb-20 font-sans text-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-xs text-gray-500 mb-8 uppercase tracking-wide">
                        <span className="cursor-pointer hover:text-black" onClick={() => navigate("/")}>
                            Home {!isInWishlist&& "haia"}
                        </span>
                        <span className="mx-2">/</span>
                        <span className="cursor-pointer hover:text-black" onClick={() => navigate("/shop")}>
                            Shop
                        </span>
                        <span className="mx-2">/</span>
                        <span className="text-black font-medium">{product.productName}</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                        <div className="w-full lg:w-1/2">
                            <div className="relative w-full h-100 md:h-150 mb-4 bg-gray-50 rounded-sm z-10">
                                <SideBySideMagnifier
                                    src={activeImage}
                                    alt={product.productName}
                                    className="h-full w-full"
                                />
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-2 justify-center lg:justify-start">
                                {selectedMaterial && selectedMaterial.images && selectedMaterial.images.length > 0 ? (
                                    selectedMaterial.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            className={`w-20 h-24 shrink-0 border ${activeImage === img.image_url ? "border-black" : "border-transparent"} transition-all`}
                                            onClick={() => setActiveImage(img.image_url)}
                                        >
                                            <img
                                                src={img.image_url}
                                                className="w-full h-full object-cover"
                                                alt={`variant-${idx}`}
                                            />
                                        </button>
                                    ))
                                ) : (
                                    <button
                                        className={`w-20 h-24 shrink-0 border ${activeImage === product.thumbnail?.image_url ? "border-black" : "border-transparent"} transition-all`}
                                        onClick={() => setActiveImage(product.thumbnail?.image_url)}
                                    >
                                        <img
                                            src={product.thumbnail?.image_url}
                                            className="w-full h-full object-cover"
                                            alt="thumbnail"
                                        />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 pt-4">
                            <h1 className="text-3xl md:text-4xl font-cormorant text-gray-900 mb-2">
                                {product.productName}
                            </h1>
                            <div className="flex items-baseline gap-4 mb-6">
                                <p className="text-2xl  text-gray-900 font-semibold">{formattedSalePrice}</p>
                                {hasDiscount && (
                                    <>
                                        <p className="text-lg text-gray-400 line-through decoration-gray-400">
                                            {formattedRegularPrice}
                                        </p>
                                        <span className="text-green-700 font-medium text-sm  px-2 py-0.5 rounded">
                                            {discountPercentage}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                                        Select Material
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {product.variants.map((variant) => (
                                            <button
                                                key={variant._id}
                                                onClick={() => setSelectedMaterial(variant)}
                                                className={`px-6 py-2 rounded-full text-xs font-medium uppercase tracking-wide border transition-all ${
                                                    selectedMaterial?._id === variant._id
                                                        ? "bg-[#CAB49E] text-white border-[#CAB49E]"
                                                        : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                                                }`}
                                            >
                                                {variant.material}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6 text-sm font-medium">
                                {selectedMaterial ? (
                                    selectedMaterial.quantity > 0 ? (
                                        selectedMaterial.quantity < 5 ? (
                                            <span className="text-orange-600">
                                                Only {selectedMaterial.quantity} left in stock!
                                            </span>
                                        ) : (
                                            <span className="text-green-600">In Stock</span>
                                        )
                                    ) : (
                                        <span className="text-red-600">Out of Stock</span>
                                    )
                                ) : (
                                    <span className="text-gray-500">Select options to see availability</span>
                                )}
                            </div>

                            <div className="flex gap-4 mb-4">
                                {cartItem ? (
                                    <div className="flex-1 flex items-center justify-between bg-[#CAB49E] text-white px-4 py-3.5 rounded-sm shadow-sm">
                                        <button
                                            onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                                            className="p-1 hover:text-gray-300 transition-colors"
                                            disabled={cartItem.quantity <= 0}
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="text-sm font-bold uppercase tracking-widest px-4">
                                            {cartItem.quantity} IN CART
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                                            className="p-1 hover:text-gray-300 transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-[#CAB49E] text-white py-3.5 px-8 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-[#bfa38a] transition-colors shadow-sm"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`flex-1 border border-[#CAB49E] py-3.5 px-8 rounded-sm text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${
                                        isInWishlist
                                            ? "bg-[#CAB49E] text-white"
                                            : "text-[#CAB49E] hover:bg-gray-50"
                                    }`}
                                >
                                    <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
                                    {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                                </button>
                            </div>

                            <div className="border-t border-gray-200 pt-8 mt-12 space-y-2">
                                <h4 className="text-sm font-medium uppercase text-gray-900 mb-4 border-b border-black pb-2 inline-block">
                                    Product Details
                                </h4>
                                <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                                    <div className="flex gap-4">
                                        <span className="w-24 font-medium text-gray-900">Brand:</span>
                                        <span>Tiffany & Co.</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="w-24 font-medium text-gray-900">Stone:</span>
                                        <span>Cubic Zirconia</span>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="w-24 font-medium text-gray-900">Category:</span>
                                        <span>{product.category?.categoryName}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-serif text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-500 font-light text-lg">{product.description}</p>
                            </div>

                            <div className="mt-12 pt-10 border-t border-gray-100">
                                <h3 className="text-xl font-serif text-gray-900 mb-6">Reviews (3)</h3>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex text-[#CAB49E]">
                                        <Star size={20} fill="currentColor" strokeWidth={0} />
                                        <Star size={20} fill="currentColor" strokeWidth={0} />
                                        <Star size={20} fill="currentColor" strokeWidth={0} />
                                        <Star size={20} fill="currentColor" strokeWidth={0} />
                                        <Star size={20} fill="currentColor" strokeWidth={0} className="text-gray-200" />
                                    </div>
                                    <span className="text-lg font-light text-gray-900">4.0 / 5</span>
                                </div>

                                <div className="space-y-6">
                                    <div className="border-b border-gray-50 pb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-gray-900">Emily R.</span>
                                            <span className="text-xs text-gray-400">2 weeks ago</span>
                                        </div>
                                        <div className="flex text-[#CAB49E] mb-2">
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Absolutely stunning piece! The quality is unmatched and it looks even better in
                                            person.
                                        </p>
                                    </div>

                                    <div className="border-b border-gray-50 pb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-gray-900">Sarah J.</span>
                                            <span className="text-xs text-gray-400">1 month ago</span>
                                        </div>
                                        <div className="flex text-[#CAB49E] mb-2">
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} className="text-gray-200" />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Beautiful packaging and fast delivery. Ideally fit a bit loose but still
                                            gorgeous.
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-gray-900">Michael B.</span>
                                            <span className="text-xs text-gray-400">2 months ago</span>
                                        </div>
                                        <div className="flex text-[#CAB49E] mb-2">
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                            <Star size={12} fill="currentColor" strokeWidth={0} />
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Perfect gift for my wife. She wears it every day!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 border-t border-gray-100 pt-16">
                        <h2 className="text-2xl font-serif text-gray-900 mb-8">Recommended for you</h2>
                        {relatedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedProducts.map((p) => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">No similar products found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
