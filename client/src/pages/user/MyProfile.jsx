import { useCurrentUser } from "@/hooks/tanstack_Queries/user/profile/useCurrentUser";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ProfileDetails = () => {
    const { data: user, isError, isLoading } = useCurrentUser();
    if (isError) {
        return <p>Failed to load user data.</p>;
    }
    if (isLoading) {
        return <SpinnerBadge />;
    }
    return (
        <>
            {/* min-w-0 prevents flex items from overflowing */}
            {/* Breadcrumb Area */}
            <div className="mb-4 md:mb-6 flex items-center gap-2 text-sm text-gray-600">
                <Link to="/account/profile" className="hover:text-black transition-colors font-semibold text-black">
                    Profile
                </Link>
                <ChevronRight size={14} />
            </div>
            <div className="w-full bg-white rounded-3xl shadow-sm md:p-5 p-5">
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* --- Profile Photo Section --- */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {/* Profile Image */}
                            <img
                                src={user?.avatar || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                            />
                        </div>
                    </div>
                    {/* ---------------------------------- */}

                    {/* Full Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Full name</label>
                        <input
                            disabled={true}
                            type="text"
                            defaultValue={user?.fullname}
                            className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-600 text-sm md:text-base focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Email</label>
                        <input
                            disabled={true}
                            type="email"
                            defaultValue={user?.email}
                            className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-600 text-sm md:text-base focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Phone</label>
                        <input
                            disabled={true}
                            type="tel"
                            defaultValue={user?.phone}
                            placeholder={!user?.phone ? "No phone number found." : ""}
                            className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-600 text-sm md:text-base focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>

                    {/* Edit Button */}
                    <div className="pt-6 flex justify-center md:justify-end">
                        <Link
                            to="/account/edit-profile"
                            className="w-full md:w-auto text-center bg-black text-white px-12 py-3 rounded-md font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors uppercase shadow-md"
                        >
                            Edit
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileDetails;
