import React from "react";
import { X } from "lucide-react";
import AddressForm from "./AddressForm";
import { useAddAddress } from "@/hooks/tanstack_Queries/user/address/useAddAddress";
import { useUpdateAddress } from "@/hooks/tanstack_Queries/user/address/useUpdateAddress";
import toast from "react-hot-toast";

const AddressModal = ({ isOpen, onClose, mode = "add", initialData = null }) => {
    const { mutateAsync: addAddress, isPending: isAdding } = useAddAddress();
    const { mutateAsync: updateAddress, isPending: isUpdating } = useUpdateAddress();

    if (!isOpen) return null;

    const handleSubmit = async (data) => {
        try {
            if (mode === "add") {
                await addAddress(data);
                toast.success("Address added successfully.");
            } else {
                await updateAddress({ addressId: initialData._id, data });
                // Hook handles success toast
            }
            onClose();
        } catch (error) {
            console.error(error);
            // Error handling is likely done in the hook or global handler, 
            // but toast.error could be added here if not.
        }
    };

    const defaultValues = mode === "edit" && initialData ? {
        fullname: initialData.fullname,
        phone: initialData.phone,
        address: initialData.address,
        district: initialData.district,
        state: initialData.state,
        city: initialData.city,
        pincode: initialData.pincode,
        landmark: initialData.landmark,
        isDefault: initialData.isDefault || false,
    } : {
        fullname: "",
        phone: "",
        address: "",
        district: "",
        state: "",
        city: "",
        pincode: "",
        landmark: "",
        isDefault: false,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl my-8">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X size={24} />
                </button>
                
                <div className="max-h-[90vh] overflow-y-auto rounded-xl">
                    <AddressForm 
                        key={mode === "edit" ? initialData?._id : "add"}
                        type={mode}
                        defaultValues={defaultValues}
                        onSubmit={handleSubmit}
                        submitLabel={mode === "add" ? "Add Address" : "Update Address"}
                        isLoading={isAdding || isUpdating}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddressModal;
