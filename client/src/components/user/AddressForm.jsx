import React from "react";
import { Link } from "react-router-dom";
import FormWrapper from "../form/Form";
import useZodForm from "@/hooks/useZodForm";
import { addressSchema } from "@/validations/address.schema";
import FormInput from "../form/FormInput";

const AddressForm = ({ type, onSubmit, defaultValues, submitLabel, isLoading }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useZodForm(addressSchema, { defaultValues });
    return (
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 md:p-12">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-300 pb-3 mb-8">
                <h2 className="text-lg md:text-xl font-bold text-black">
                    {type === "edit" ? "Update your address" : "Add Address"}
                </h2>
                <span className="text-gray-900 text-sm md:text-base font-medium mb-1">Personal Information</span>
            </div>

            {/* --- Form Section --- */}
            <FormWrapper onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <FormInput
                        label="Fullname"
                        type="text"
                        name="fullname"
                        register={register}
                        error={errors.fullname}
                        placeholder="Full name"
                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <FormInput
                        label="Phone"
                        type="text"
                        name="phone"
                        register={register}
                        error={errors.phone}
                        placeholder="Phone"
                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* Address (Full Width) */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-900">Address</label>

                    <textarea
                        type="text"
                        {...register("address")}
                        placeholder="House Name , House Number, Locality"
                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black outline-none resize-none"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                {/* District */}
                <div className="space-y-2">
                    <FormInput
                        label="District"
                        type="text"
                        name="district"
                        register={register}
                        error={errors.district}
                        placeholder="eg : Ernakulam"
                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* State */}
                <div className="space-y-2">
                    <FormInput
                        label="State"
                        type="text"
                        name="state"
                        register={register}
                        error={errors.state}
                        placeholder="eg : Kerala"
                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* City */}
                <div className="space-y-2">
                    <FormInput
                        label="City"
                        type="text"
                        name="city"
                        register={register}
                        placeholder="eg : Marad"
                        error={errors.city}
                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* Pin Code */}
                <div className="space-y-2">
                    <FormInput
                        label="Pin Code"
                        type="text"
                        name="pincode"
                        register={register}
                        error={errors.pincode}
                        placeholder="eg : 689230"
                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* Landmark */}
                <div className="space-y-2 md:col-span-1">
                    <FormInput
                        label="Landmark ( optional )"
                        type="text"
                        name="landmark"
                        register={register}
                        error={errors.landmark}
                        placeholder="eg : Hospital"
                        className="w-full bg-gray-100 border-none rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-black outline-none"
                    />
                </div>

                {/* Spacer div to keep grid alignment if needed, or leave empty */}
                <div className="hidden md:block"></div>

                {/* --- Set as Default Checkbox --- */}
                <div className="md:col-span-2 flex items-center space-x-3 mt-2">
                    <input
                        type="checkbox"
                        id="isDefault"
                        {...register("isDefault")}
                        className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black accent-black cursor-pointer"
                    />
                    <label htmlFor="isDefault" className="text-gray-700 font-medium cursor-pointer select-none text-sm">
                        Set as default address
                    </label>
                </div>
                {/* Buttons */}
                <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                    <Link
                        to="/account/address"
                        className="bg-gray-600 text-white px-8 py-2.5 rounded-md font-medium text-sm hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-black text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors"
                    >
                        {isLoading ? "Please wait..." : submitLabel}
                    </button>
                </div>
            </FormWrapper>
        </div>
    );
};

export default AddressForm;
