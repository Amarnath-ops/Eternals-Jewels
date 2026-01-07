import React from "react";
import AddressForm from "@/components/user/AddressForm";
import Sidebar from "@/components/user/UserSidebar";
import { useAddAddress } from "@/hooks/tanstack_Queries/address/useAddAddress";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { ChevronRight } from "lucide-react";

const AddressAddPage = () => {
    const { mutateAsync, isPending } = useAddAddress();
    const navigate = useNavigate();
    const handleAdd = async (data) => {
        await mutateAsync(data);
        navigate("/account/address");
        toast.success("Address added successfully.");
    };
    return (
        <>
            {/* min-w-0 prevents flex items from overflowing */}
            {/* Breadcrumb Area */}
            <div className="mb-4 md:mb-6 flex items-center gap-2 text-sm text-gray-600">
                <Link to="/account/address" className="hover:text-black transition-colors font-semibold text-black">
                    My Address
                </Link>
                <ChevronRight size={14} />
                <Link to="/account/add-address" className="font-semibold text-black">
                    Add Address
                </Link>
            </div>
            <AddressForm
                defaultValues={{
                    fullname: "",
                    phone: "",
                    address: "",
                    district: "",
                    state: "",
                    city: "",
                    pincode: "",
                    lankmark: "",
                    isDefault: "",
                }}
                onSubmit={handleAdd}
                submitLabel={"Add Address"}
                type="add"
                isLoading={isPending}
            />
        </>
    );
};

export default AddressAddPage;
