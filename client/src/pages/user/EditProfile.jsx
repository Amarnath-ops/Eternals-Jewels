import React, { useState } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import useZodForm from "@/hooks/useZodForm";
import { profileDetailsSchema } from "@/validations/profile.schema";
import FormWrapper from "../../components/form/Form";
import { useUpdateProfile } from "@/hooks/tanstack_Queries/profile/useUpdateProfile";
import FormInput from "../../components/form/FormInput";
import { useRequestEmailChange } from "@/hooks/tanstack_Queries/profile/useEmailChange";
import EmailOtpModal from "../../components/user/EmailOtpModal";
import { useCurrentUser } from "@/hooks/tanstack_Queries/profile/useCurrentUser";
import { SpinnerBadge } from "@/components/Spinner";
import { Link } from "react-router-dom";

const EditProfile = () => {
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [pendingEmail, setPendingEmail] = useState(null);
    
    const { data: user, isLoading } = useCurrentUser();
    const [preview, setPreview] = useState(user?.avatar);

    const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutateAsync: requestEmailOtp, isPending: isRequesting } = useRequestEmailChange();
    
    const {
        handleSubmit,
        register,
        formState: { errors,isDirty },
        setValue,
        setError,
    } = useZodForm(profileDetailsSchema, {
        defaultValues: {
            fullname: user?.fullname || "",
            email: user?.email || "",
            phone: user?.phone ? user.phone.split(" ")[user.phone.split(" ").length - 1] : "",
        },
    });

    const onSubmit = async (data) => {
        data.phone = `+91 ${data.phone}`;
        try {
            const isEmailChanged = data.email !== user.email;
            if (isEmailChanged) {
                await requestEmailOtp(data.email);
                setPendingEmail(data.email);
                setShowOtpModal(true);
            }
            const formData = new FormData();

            formData.append("fullname", data.fullname);
            formData.append("phone", data.phone);
            if (data.avatar) {
                formData.append("avatar", data.avatar);
            }
            await updateProfile(formData);
        } catch (error) {
            console.error(error);
            setError("email", { message: error.response?.data?.message });
        }
    };
    if (isLoading) {
        return <SpinnerBadge />;
    }

    return (
        <div className="flex-1 w-full min-w-0">
            {/* Breadcrumb Area */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                <Link to="/account/profile" className="hover:text-black transition-colors">
                    Profile
                </Link>
                <ChevronRight size={14} />
                <Link to="/account/edit-profile" className="font-semibold text-black">
                    Edit Profile
                </Link>
            </div>

            {/* Main Content Card */}
            {/* Adjusted padding: p-6 for mobile, p-12 for desktop to fix alignment */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-12">
                <FormWrapper onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
                    
                    {/* --- Profile Photo Section --- */}
                    <div className="flex justify-center mb-6">
                        <div className="relative group">
                            {/* Profile Image */}
                            <img
                                src={preview || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                            />
                            {/* Edit Icon (Pencil) */}
                            <button
                                type="button"
                                className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors cursor-pointer"
                                title="Edit photo"
                            >
                                <Pencil size={16} />
                                {/* File Input - Fully covers the button for better clickability */}
                                <input
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setValue("avatar", file, {
                                                shouldDirty: true,
                                                shouldValidate: true,
                                            });
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </button>
                        </div>
                    </div>
                    {/* ---------------------------------- */}

                    {/* Full Name Input */}
                    <div className="space-y-2">
                        <FormInput
                            label="Full name"
                            type="text"
                            name="fullname"
                            className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-600 focus:ring-2 focus:ring-black outline-none"
                            register={register}
                            error={errors.fullname}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <FormInput
                            label="Email"
                            type="text"
                            name="email"
                            className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-600 focus:ring-2 focus:ring-black outline-none"
                            register={register}
                            error={errors.email}
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-2">
                        <FormInput
                            label="Phone"
                            type="tel"
                            name="phone"
                            register={register}
                            error={errors.phone}
                            className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-600 focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>

                    {/* Edit Button */}
                    <div className="pt-6 flex justify-center md:justify-end">
                        <button
                            disabled={isRequesting || isUpdating || !isDirty}
                            className={`w-full md:w-auto bg-black text-white px-12 py-3 rounded-md font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors uppercase disabled:opacity-50 ${!isDirty&& "cursor-not-allowed "}`}
                            type="submit"
                        >
                            {isRequesting || isUpdating ? "Updating..." : "Update"}
                        </button>
                    </div>
                </FormWrapper>
            </div>
            {showOtpModal && <EmailOtpModal email={pendingEmail} onClose={() => setShowOtpModal(false)} />}
        </div>
    );
};

export default EditProfile;