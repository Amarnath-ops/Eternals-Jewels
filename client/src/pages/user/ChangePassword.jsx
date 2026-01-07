import React, { useState } from "react";
import FormWrapper from "../../components/form/Form";
import useZodForm from "@/hooks/useZodForm";
import { changePasswordSchema } from "@/validations/auth.schema";
import FormInput from "../../components/form/FormInput";
import { useChangePassword } from "@/hooks/tanstack_Queries/profile/useChangePassword";
import { SpinnerBadge } from "../../components/Spinner";
import { EyeIcon, EyeOff } from "lucide-react";
import { useCurrentUser } from "@/hooks/tanstack_Queries/profile/useCurrentUser";

const ChangePassword = () => {
  const {data:user,isLoading} = useCurrentUser()
    const initialShowPasswordState = {
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false,
    };
    const [showPassword, setShowPassword] = useState(initialShowPasswordState);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useZodForm(changePasswordSchema);
    const { mutateAsync, isPending } = useChangePassword();
    const onSubmit = (data) => {
        mutateAsync(data);
        reset();
    };
    if (isPending || isLoading) {
        return <SpinnerBadge />;
    }
    return (
        <div>
            {/* Main Card */}
            <div className="bg-white p-8 md:p-16 rounded-3xl shadow-sm max-w-4xl mx-auto flex flex-col items-center justify-center h-143.75">
                {user.provider === "google" ? (
                    <p>Password change is not available for Google sign-in accounts.</p>
                ) : (
                    <div>
                        {/* Header */}
                        <h2 className="text-2xl md:text-3xl font-normal text-black mb-2 text-center">
                            Change Password for
                        </h2>
                        <p className="text-lg text-gray-600 mb-10 text-center">{user.email}</p>

                        {/* Form */}
                        <FormWrapper onSubmit={handleSubmit(onSubmit)} className=" w-full md:min-w-150 max-w-md space-y-6">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <FormInput
                                        type={showPassword.currentPassword ? `text` : `password`}
                                        label="Current Password"
                                        name="currentPassword"
                                        placeholder="Current Password"
                                        register={register}
                                        error={errors.currentPassword}
                                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    />
                                    <div
                                        className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-500"
                                        onClick={() =>
                                            setShowPassword({
                                                ...showPassword,
                                                currentPassword: !showPassword.currentPassword,
                                            })
                                        }
                                    >
                                        {!showPassword.currentPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <FormInput
                                        type={showPassword.newPassword ? `text` : `password`}
                                        label="New Password"
                                        name="newPassword"
                                        placeholder="Password"
                                        register={register}
                                        error={errors.newPassword}
                                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    />
                                    <div
                                        className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-500"
                                        onClick={() =>
                                            setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })
                                        }
                                    >
                                        {!showPassword.newPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <FormInput
                                        type={showPassword.confirmNewPassword ? `text` : `password`}
                                        label="Confirm New Password"
                                        name="confirmNewPassword"
                                        placeholder="Confirm Password"
                                        register={register}
                                        error={errors.confirmNewPassword}
                                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    />
                                    <div
                                        className="absolute right-4 top-12 transform -translate-y-1/2 text-gray-500"
                                        onClick={() =>
                                            setShowPassword({ ...showPassword, confirmNewPassword: !showPassword.confirmNewPassword })
                                        }
                                    >
                                        {!showPassword.confirmNewPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Button */}
                            <div className="pt-4 flex justify-center">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-8 py-3 rounded-md font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors"
                                >
                                    Update Password
                                </button>
                            </div>
                        </FormWrapper>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangePassword;
