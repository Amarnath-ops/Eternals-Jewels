import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Gift, Search, X } from "lucide-react";
import { useGetOffers } from "@/hooks/tanstack_Queries/admin/offer/useGetOffers";
import { useToggleOfferStatus, useDeleteOffer } from "@/hooks/tanstack_Queries/admin/offer/useOfferMutations";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/Pagination";

const OfferList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    
    const { data: offersData, isLoading, isFetching } = useGetOffers(page, 10, debouncedSearch);
    const { mutate: toggleStatus } = useToggleOfferStatus();
    const { mutate: deleteOffer } = useDeleteOffer();

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this offer?")) {
            deleteOffer(id);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-[#A47F64] p-2 rounded-lg text-white">
                        <Gift size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
                </div>
                <Link
                    to="/admin/offers/add-offer"
                    className="flex items-center gap-2 bg-[#A47F64] text-white px-4 py-2 rounded-lg hover:bg-[#8B6D51] transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Create New Offer</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search offers by name..."
                            value={search}
                            onChange={handleSearch}
                            className="border border-gray-300 rounded-lg pl-10 pr-10 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-[#A47F64] focus:border-transparent"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setPage(1);
                                }}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">OFFER NAME</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">TYPE</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">DISCOUNT</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">VALIDITY</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">STATUS</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-16">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A47F64]"></div>
                                            <span className="ml-3 text-gray-500 font-medium">Loading offers...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : offersData?.data?.offers?.length > 0 ? (
                                offersData.data.offers.map((offer) => (
                                    <tr key={offer._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-gray-900">{offer.offerName}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                offer.offerType === 'Product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {offer.offerType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-[#A47F64]">
                                            {offer.discountPercentage}% OFF
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 text-xs leading-relaxed">
                                            <div>S: {new Date(offer.startDate).toLocaleDateString()}</div>
                                            <div>E: {new Date(offer.endDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button 
                                                onClick={() => toggleStatus(offer._id)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                                    offer.isActive 
                                                        ? 'bg-green-100 text-green-800 border-green-200' 
                                                        : 'bg-red-100 text-red-800 border-red-200'
                                                }`}
                                            >
                                                {offer.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 flex justify-end gap-3 text-right">
                                            <Link 
                                                to={`/admin/offers/edit-offer/${offer._id}`}
                                                className="text-blue-500 hover:text-blue-700 p-1"
                                                title="Edit Offer"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(offer._id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Delete Offer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-500 italic">
                                        No offers found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {offersData?.data?.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination 
                            currentPage={page}
                            totalPages={offersData.data.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfferList;
