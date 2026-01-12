import React, { useState } from "react";
import { Plus, Pencil, Trash2, MapPinOff, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteAddress } from "@/hooks/tanstack_Queries/address/useDeleteAddress";
import { SpinnerBadge } from "../../components/Spinner";
import ConfirmModal from "../../components/Modal";
import { useGetAddress } from "@/hooks/tanstack_Queries/address/useAddresses";

const AddressContent = () => {
    const {data:addresses,isLoading} = useGetAddress()
    const { mutateAsync, isPending } = useDeleteAddress();
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [addressId, setAddressId] = useState(null);

    const handleDeleteAddress = async () => {
        await mutateAsync(addressId);
        setOpenConfirmModal(false);
    };

    const clickDeleteAddress = (id) => {
        setOpenConfirmModal(true);
        setAddressId(id);
    };

    if (isPending || isLoading) {
        return <SpinnerBadge />;
    }

    return (
        <>
            {/* min-w-0 prevents flex items from overflowing */}
            {/* Breadcrumb Area */}
            <div className="mb-4 md:mb-6 flex items-center gap-2 text-sm text-gray-600">
                <Link to="/account/address" className="hover:text-black transition-colors font-semibold text-black">
                    My Address
                </Link>
                <ChevronRight size={14} />
            </div>
            <div className="flex-1 bg-white rounded-3xl shadow-sm p-6 md:p-12">
                {/* Header with Add Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">My Addresses</h2>
                    <Link
                        to="/account/add-address"
                        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
                    >
                        <Plus size={18} />
                        <span>Add New Address</span>
                    </Link>
                </div>

                {/* Address List */}
                <div className="space-y-4 md:space-y-6">
                    {addresses?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                <MapPinOff className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No Addresses Found</h3>
                            <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                You haven't added any delivery addresses yet. Click the "Add New Address" button above to get started.
                            </p>
                        </div>
                    )}

                    {addresses?.map((addr) => (
                        <div key={addr._id} className="group">
                            {/* The Address Card */}
                            <div className="bg-[#F4F1EE] p-5 md:p-8 rounded-2xl relative border border-transparent group-hover:border-gray-200 transition-all">
                                
                                {/* Content Wrapper - Adds padding on right for desktop to avoid button overlap */}
                                <div className="md:pr-32">
                                    {/* Default Badge */}
                                    {addr.isDefault && (
                                        <span className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 rounded mb-3 uppercase tracking-wider">
                                            Default
                                        </span>
                                    )}

                                    <div className="space-y-2 text-gray-700">
                                        <p className="font-bold text-black text-lg md:text-xl">{addr.fullname}</p>
                                        <p className="text-sm md:text-base leading-relaxed">
                                            {addr.address}, {addr.city}
                                        </p>
                                        <p className="text-sm md:text-base">
                                            {addr.state} - <span className="font-medium text-black">{addr.pincode}</span>
                                        </p>
                                        {addr.landmark && (
                                            <p className="text-sm text-gray-500">
                                                <span className="font-medium text-gray-700">Landmark:</span> {addr.landmark}
                                            </p>
                                        )}
                                        <p className="text-sm md:text-base font-medium pt-1">
                                            Phone: <span className="text-black">{addr.phone}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {/* Mobile: Flex row at bottom. Desktop: Absolute top-right */}
                                <div className="mt-6 md:mt-0 flex gap-3 md:absolute md:top-8 md:right-8 border-t md:border-t-0 border-gray-200 pt-4 md:pt-0">
                                    <Link
                                        to={`/account/edit-address/${addr._id}`}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-100"
                                        title="Edit Address"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => clickDeleteAddress(addr._id)}
                                        className="flex-none p-2 bg-white text-red-500 rounded-lg shadow-sm hover:bg-red-50 transition-colors border border-gray-100"
                                        title="Delete Address"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                <div className="w-full max-w-sm p-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-50 p-3 rounded-full">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Address?</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete this address? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button 
                            className="flex-1 py-2.5 px-4 font-medium rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" 
                            onClick={() => setOpenConfirmModal(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="flex-1 py-2.5 px-4 font-medium rounded-xl bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-colors" 
                            onClick={handleDeleteAddress}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </ConfirmModal>
        </>
    );
};

export default AddressContent;