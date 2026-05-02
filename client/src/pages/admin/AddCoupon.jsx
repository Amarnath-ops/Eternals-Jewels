import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCoupon } from "@/hooks/tanstack_Queries/admin/coupon/useMutateCoupons";
import { couponSchema } from "@/validations/coupon.schema";
import useZodForm from "@/hooks/useZodForm";
import FormInput from "@/components/form/FormInput";

const AddCoupon = () => {
    const navigate = useNavigate();
    const { mutate: addCoupon, isPending } = useCreateCoupon();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useZodForm(couponSchema, {
        defaultValues: {
            code: "",
            discountType: "percentage",
            discountAmount: 0,
            minPurchaseAmount: 0,
            maxDiscountAmount: "",
            usageLimitPerUser: 1,
            startDate: "",
            expiryDate: "",
        }
    });

    const discountType = watch("discountType");

    const onSubmit = (data) => {
        const dataToSubmit = { ...data };
        if (dataToSubmit.discountType !== "percentage") {
            delete dataToSubmit.maxDiscountAmount;
        }
        if (dataToSubmit.maxDiscountAmount === "") {
            dataToSubmit.maxDiscountAmount = null;
        }

        addCoupon(dataToSubmit, {
            onSuccess: () => navigate("/admin/coupons")
        });
    };

    const inputClasses = "w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A47F64] focus:border-transparent";

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Coupon</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Coupon Code *"
                        name="code"
                        register={register}
                        error={errors.code}
                        placeholder="e.g. SUMMER10"
                        className={`${inputClasses} uppercase placeholder:normal-case`}
                    />

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <FormInput
                                label="Start Date *"
                                type="date"
                                name="startDate"
                                register={register}
                                error={errors.startDate}
                                className={inputClasses}
                            />
                        </div>
                        <div className="w-1/2">
                            <FormInput
                                label="Expiry Date *"
                                type="date"
                                name="expiryDate"
                                register={register}
                                error={errors.expiryDate}
                                className={inputClasses}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 font-medium ml-1">Discount Type *</label>
                        <select
                            {...register("discountType")}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A47F64] focus:border-transparent bg-white"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                        {errors.discountType && <p className="text-red-500 text-sm mt-1">{errors.discountType.message}</p>}
                    </div>
                    <FormInput
                        label={`Discount Amount * ${discountType === "percentage" ? "(%)" : "(₹)"}`}
                        type="number"
                        name="discountAmount"
                        register={register}
                        error={errors.discountAmount}
                        className={inputClasses}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Minimum Purchase Amount (₹)"
                        type="number"
                        name="minPurchaseAmount"
                        register={register}
                        error={errors.minPurchaseAmount}
                        className={inputClasses}
                    />
                    <FormInput
                        label="Max Discount Amount (₹)"
                        type="number"
                        name="maxDiscountAmount"
                        register={register}
                        error={errors.maxDiscountAmount}
                        disabled={discountType !== "percentage"}
                        placeholder={discountType !== "percentage" ? "N/A for fixed amount" : ""}
                        className={`${inputClasses} disabled:bg-gray-100 disabled:text-gray-400`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Usage Limit Per User"
                        type="number"
                        name="usageLimitPerUser"
                        register={register}
                        error={errors.usageLimitPerUser}
                        className={inputClasses}
                        min="1"
                    />
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/coupons")}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-6 py-2 bg-[#A47F64] text-white rounded-md hover:bg-[#8B6D51] transition-colors font-medium shadow-sm disabled:opacity-50"
                    >
                        {isPending ? "Adding..." : "Add Coupon"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCoupon;
