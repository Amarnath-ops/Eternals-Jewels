import React, { useCallback } from "react";
import AddressForm from "@/components/user/AddressForm";
import Sidebar from "@/components/user/UserSidebar";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { SpinnerBadge } from "@/components/Spinner";
import { useGetAddress } from "@/hooks/tanstack_Queries/address/useAddresses";
import { useUpdateAddress } from "@/hooks/tanstack_Queries/address/useUpdateAddress";

const AddressEditPage = () => {
    const { addressId } = useParams();
    const navigate = useNavigate();
    const { data: addresses, isLoading: fetchingAddress, isError } = useGetAddress();
    const address = addresses?.find((a) => a._id === addressId);
    const { mutateAsync, isPending } = useUpdateAddress();
    const handleEdit = useCallback(
        async (data) => {
            await mutateAsync({ addressId, data });
            navigate("/account/address");
        },
        [addressId, mutateAsync, navigate]
    );
    if (isError) {
        return <p>Failed to load Address data.</p>;
    }
    if (fetchingAddress) {
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
                <Link to="/account/add-address" className="font-semibold text-black">
                    Add Address
                </Link>
            </div>
            <AddressForm
                type="edit"
                defaultValues={{
                    fullname: address.fullname,
                    phone: address.phone,
                    address: address.address,
                    district: address.district,
                    state: address.state,
                    city: address.city,
                    pincode: address.pincode,
                    landmark: address.landmark,
                }}
                submitLabel="Update Address"
                onSubmit={handleEdit}
                isLoading={isPending}
            />
        </>
    );
};

export default AddressEditPage;
