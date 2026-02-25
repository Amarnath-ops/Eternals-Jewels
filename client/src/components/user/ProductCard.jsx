import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAddToWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useAddToWishlist";
import { useRemoveFromWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useRemoveFromWishlist";
import { useGetWishlist } from "@/hooks/tanstack_Queries/user/wishlist/useGetWishlist";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { productName, thumbnail, category, variants, _id } = product;
  const price = variants && variants.length > 0 ? variants[0].salePrice : 0;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);

  const isLogin = useSelector((state) => state.user.isLogin);
  const { data: wishlistData } = useGetWishlist({ enabled: !!isLogin });
  const { mutate: addToWishlist, isPending: isAdding } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemoving } = useRemoveFromWishlist();

  const variantId = variants && variants.length > 0 ? variants[0]._id : null;
  const isInWishlist = wishlistData?.wishlist?.items?.some(
      (item) => item.productId === _id && item.variantId === variantId
  );

  const handleWishlist = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isLogin) {
          toast.error("Please login to add to wishlist");
          return;
      }
      
      if (!variantId) {
          toast.error("Product variant not found");
          return;
      }

      const data = { productId: _id, variantId };

      if (isInWishlist) {
          removeFromWishlist(data);
      } else {
          addToWishlist(data);
      }
  };

  
  const displayImage = variants && variants[0]?.images && variants[0].images.length > 0
    ? variants[0].images[0].image_url
    : thumbnail?.image_url;

  return (
    <div className="group relative bg-[#FDF8F5] pb-4 rounded-sm shadow-sm transition-shadow hover:shadow-md">
        {}
        <div className="p-3 pb-0">
             <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-white">
                {displayImage ? (
                    <img
                        src={displayImage}
                        alt={productName}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50">No Image</div>
                )}
             </div>
        </div>
        
        <div className="mt-3 px-4 flex flex-col">
            <h3 className="text-[13px] font-bold uppercase tracking-wide text-gray-800 truncate">
                <Link to={`/product/${_id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {productName}
                </Link>
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 font-medium">{category?.categoryName}</p>
            
            <div className="mt-2 flex items-center justify-between">
                 <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900">{formattedPrice}</p>
                      {variants?.[0]?.regularPrice > variants?.[0]?.salePrice && (
                          <div className="flex items-center gap-2 mt-0.5">
                               <p className="text-[10px] text-gray-400 line-through">
                                   ₹{variants[0].regularPrice}
                               </p>
                               <span className="text-[9px] text-green-600 font-bold">
                                   {Math.round(((variants[0].regularPrice - variants[0].salePrice) / variants[0].regularPrice) * 100)}% OFF
                               </span>
                          </div>
                      )}
                 </div>
                 <div className="flex flex-col items-end gap-1">
                      <div className="flex text-yellow-400 text-[10px] gap-0.5">
                          {'★★★★★'.split('').map((star, i) => (
                              <span key={i}>{star}</span>
                          ))}
                      </div>
                 </div>
            </div>

            {}
             <button 
                onClick={handleWishlist}
                disabled={isAdding || isRemoving}
                className={`relative z-10 mt-3 w-full flex items-center justify-center gap-2 rounded-full border py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    isInWishlist 
                    ? "bg-[#8B7E74] text-white border-[#8B7E74]" 
                    : "border-[#D4C4B7] text-[#8B7E74] hover:bg-[#8B7E74] hover:text-white hover:border-[#8B7E74]"
                }`}
             >
                <Heart size={12} className={`mb-0.5 ${isInWishlist ? "fill-white text-white" : ""}`} /> 
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
             </button>
        </div>
    </div>
  );
};

export default ProductCard;
