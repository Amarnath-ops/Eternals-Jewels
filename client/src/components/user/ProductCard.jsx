import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { productName, thumbnail, category, variants, _id } = product;
  const price = variants && variants.length > 0 ? variants[0].salePrice : 0;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);

  
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
                 <p className="text-sm font-medium text-gray-900">{formattedPrice}</p>
                 <div className="flex text-yellow-400 text-[10px] gap-0.5">
                     {'★★★★★'.split('').map((star, i) => (
                         <span key={i}>{star}</span>
                     ))}
                 </div>
            </div>

            {}
             <button className="relative z-10 mt-3 w-full flex items-center justify-center gap-2 rounded-full border border-[#D4C4B7] py-2 text-[10px] font-bold uppercase tracking-widest text-[#8B7E74] hover:bg-[#8B7E74] hover:text-white hover:border-[#8B7E74] transition-all">
                <Heart size={12} className="mb-0.5" /> 
                Add to Wishlist
             </button>
        </div>
    </div>
  );
};

export default ProductCard;
