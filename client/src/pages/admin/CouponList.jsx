import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmModal from "@/components/Modal";
import { Plus, Edit, Trash2, Search, X, AlertCircle } from "lucide-react";
import { useGetAdminCoupons } from "@/hooks/tanstack_Queries/admin/coupon/useGetAdminCoupons";
import { useToggleCouponStatus, useDeleteCoupon } from "@/hooks/tanstack_Queries/admin/coupon/useMutateCoupons";
import { SpinnerBadge } from "@/components/Spinner";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/Pagination";

const CouponList = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500); 
    
    const { data: couponsData, isLoading, isFetching } = useGetAdminCoupons(page, 10, debouncedSearch);
    const { mutate: toggleStatus } = useToggleCouponStatus();
    const { mutate: deleteCoupon, isPending: isDeleting } = useDeleteCoupon();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCouponId, setSelectedCouponId] = useState(null);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on new search stroke
    };

    const handleDeleteClick = (id) => {
        setSelectedCouponId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteCoupon = () => {
        if (selectedCouponId) {
            deleteCoupon(selectedCouponId, {
                onSuccess: () => setIsDeleteModalOpen(false)
            });
        }
    };
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Coupons Management</h1>
                <Link
                    to="/admin/coupons/add-coupon"
                    className="flex items-center gap-2 bg-[#A47F64] text-white px-4 py-2 rounded-lg hover:bg-[#8B6D51] transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Add New Coupon</span>
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
                            placeholder="Search coupons by code..."
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
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">CODE</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">TYPE</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">AMOUNT</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">USAGE LIMIT</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">START DATE</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">EXPIRY DATE</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider">STATUS</th>
                                <th className="py-4 px-6 font-semibold text-gray-700 text-sm tracking-wider text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading || isFetching ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-16">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A47F64]"></div>
                                            <span className="ml-3 text-gray-500 font-medium">Loading coupons...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : couponsData?.coupons?.length > 0 ? (
                                couponsData.coupons.map((coupon) => (
                                    <tr key={coupon._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6 font-bold text-gray-900 uppercase">{coupon.code}</td>
                                        <td className="py-4 px-6 text-gray-600 capitalize">{coupon.discountType}</td>
                                        <td className="py-4 px-6 text-gray-600 font-medium">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `₹${coupon.discountAmount}`}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{coupon.usageLimitPerUser} per user</td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {coupon.startDate ? new Date(coupon.startDate).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {new Date(coupon.expiryDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span 
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    coupon.isActive 
                                                        ? 'bg-green-100 text-green-800 border border-green-200' 
                                                        : 'bg-red-100 text-red-800 border border-red-200'
                                                }`}
                                            >
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 flex justify-end gap-3 text-right">
                                            <Link 
                                                to={`/admin/coupons/edit-coupon/${coupon._id}`}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Edit Coupon"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => toggleStatus(coupon._id)}
                                                className={`${coupon.isActive ? 'text-orange-500 hover:text-orange-700' : 'text-green-600 hover:text-green-800'} font-medium text-sm`}
                                                title={coupon.isActive ? "Deactivate" : "Activate"}
                                            >
                                                {coupon.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(coupon._id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Delete Coupon"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-500">
                                        No coupons found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {couponsData?.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <Pagination 
                            currentPage={page}
                            totalPages={couponsData.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            <ConfirmModal open={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)}>
                <div className="w-full max-w-sm p-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-50 p-3 rounded-full">
                            <AlertCircle size={32} className="text-red-500" />
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Coupon?</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete this coupon? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button 
                            className="flex-1 py-2.5 px-4 font-medium rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" 
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button 
                            className="flex-1 py-2.5 px-4 font-medium rounded-xl bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-colors disabled:opacity-50" 
                            onClick={confirmDeleteCoupon}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, delete it'}
                        </button>
                    </div>
                </div>
            </ConfirmModal>

        </div>
    );
};

export default CouponList;
