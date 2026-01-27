import React, { useState } from "react";
import { X, Package, Tag, Layers, FileText, IndianRupee } from "lucide-react";

const ProductDetailsModal = ({ open, onClose, product }) => {
    if (!open || !product) return null;

    const [activeImage, setActiveImage] = useState(
        product.thumbnail?.image_url || "/placeholder.png"
    );

    // Collect all images: thumbnail + gallery
    const allImages = [
        product.thumbnail?.image_url,
        ...(product.productImages?.map((img) => img.image_url) || []),
    ].filter(Boolean);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Content */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                >
                    <X size={20} className="text-gray-600" />
                </button>

                {/* Left Side: Images */}
                <div className="w-full md:w-1/2 bg-gray-50/50 p-6 flex flex-col gap-4 border-r border-gray-100">
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 p-2 flex items-center justify-center overflow-hidden aspect-square shadow-sm">
                        <img 
                            src={activeImage} 
                            alt={product.productName} 
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                    
                    {/* Gallery Thumbs */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                                    activeImage === img 
                                    ? "border-black ring-1 ring-black/20" 
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <img src={img} alt="thumb" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                             <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                product.isListed 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                                {product.isListed ? "Active / Listed" : "Hidden / Unlisted"}
                            </span>
                            <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">
                                {product.category?.categoryName || "Uncategorized"}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                            {product.productName}
                        </h2>
                    </div>

                    {/* Description */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-sm">
                            <FileText size={16} className="text-gray-500" />
                            Description
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                            {product.description || "No description provided."}
                        </p>
                    </div>

                    {/* Variants Table */}
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
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {variant.material}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                                {variant.sku}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {variant.quantity > 0 ? (
                                                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs">{variant.quantity}</span>
                                                ) : (
                                                    <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">Out</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-bold text-gray-900">₹{variant.salePrice}</span>
                                                    {variant.regularPrice > variant.salePrice && (
                                                        <span className="text-xs text-gray-400 line-through">₹{variant.regularPrice}</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="mt-auto pt-6 text-xs text-gray-400 border-t border-gray-100 flex justify-between">
                         <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
