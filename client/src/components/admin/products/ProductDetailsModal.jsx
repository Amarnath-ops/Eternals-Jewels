import React, { useState } from "react";
import { X, Package, Tag, Layers, FileText, IndianRupee, Image as ImageIcon } from "lucide-react";

const ProductDetailsModal = ({ open, onClose, product }) => {
    const [activeImage, setActiveImage] = useState(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0); 

    
    if (!open || !product) return null;

    
    console.log('Product data:', product);
    console.log('Variants:', product.variants);
    if (product.variants && product.variants.length > 0) {
        console.log('First variant:', product.variants[0]);
        console.log('First variant images:', product.variants[0].images);
    }

    
    
    const displayImages = selectedVariantIndex !== null
        ? product.variants[selectedVariantIndex]?.images?.map(img => img.image_url) || []
        : product.variants[0]?.images?.map(img => img.image_url) || [];

    
    const displayImage = activeImage || displayImages[0];

    
    const handleVariantSelect = (index) => {
        console.log('Selected variant index:', index);
        if (index !== null && product.variants[index]) {
            console.log('Selected variant:', product.variants[index]);
            console.log('Variant images:', product.variants[index].images);
        }
        setSelectedVariantIndex(index);
        setActiveImage(null); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200">
                {}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                {}
                <div className="w-full md:w-1/2 bg-gray-50/50 p-6 flex flex-col gap-4 border-r border-gray-100">
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center overflow-hidden aspect-square shadow-sm">
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={product.productName}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <ImageIcon size={48} />
                                <p className="text-sm mt-2">No image available</p>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">View Images By:</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {}
                            {product.variants?.map((variant, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleVariantSelect(idx)}
                                    className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                                        selectedVariantIndex === idx
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {variant.material}
                                    {variant.images && variant.images.length > 0 && (
                                        <span className="ml-1.5 text-xs opacity-75">({variant.images.length})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {displayImages.length > 0 ? (
                            displayImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                                        activeImage === img
                                            ? "border-black ring-1 ring-black/20"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                </button>
                            ))
                        ) : (
                            <div className="w-full text-center text-gray-400 text-sm py-4">
                                No images for this variant
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    {}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                    product.isListed
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                }`}
                            >
                                {product.isListed ? "Active / Listed" : "Hidden / Unlisted"}
                            </span>
                            <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                                {product.category?.categoryName || "Uncategorized"}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.productName}</h2>
                    </div>

                    {}
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-sm">
                            <FileText size={16} className="text-gray-500" />
                            Description
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {product.description || "No description provided."}
                        </p>
                    </div>

                    {}
                    <div>
                        <div className="flex items-center gap-2 mb-3 text-gray-900 font-bold text-sm">
                            <Layers size={16} className="text-gray-500" />
                            Variants & Pricing
                        </div>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#f8f9fa] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3">Material</th>
                                        <th className="px-4 py-3">SKU</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {product.variants?.map((variant, idx) => (
                                        <tr 
                                            key={idx} 
                                            onClick={() => handleVariantSelect(idx)}
                                            className={`cursor-pointer transition-colors ${
                                                selectedVariantIndex === idx 
                                                    ? "bg-black/5 border-l-4 border-l-black" 
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {variant.material}
                                                {variant.images && variant.images.length > 0 && (
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        ({variant.images.length} img{variant.images.length > 1 ? 's' : ''})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{variant.sku}</td>
                                            <td className="px-4 py-3 text-center">
                                                {variant.quantity > 0 ? (
                                                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs">
                                                        {variant.quantity}
                                                    </span>
                                                ) : (
                                                    <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">
                                                        Out
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-bold text-gray-900">₹{variant.salePrice}</span>
                                                    {variant.regularPrice > variant.salePrice && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ₹{variant.regularPrice}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {}
                    <div className="mt-auto pt-6 text-xs text-gray-400 border-t border-gray-100 flex justify-between">
                        <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
