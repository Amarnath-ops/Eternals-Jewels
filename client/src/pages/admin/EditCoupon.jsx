import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCouponById } from "@/hooks/tanstack_Queries/admin/coupon/useGetAdminCoupons";
import { useUpdateCoupon } from "@/hooks/tanstack_Queries/admin/coupon/useMutateCoupons";
import { SpinnerBadge } from "@/components/Spinner";

const EditCoupon = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { data: couponData, isLoading } = useGetCouponById(id);
    const { mutate: updateCoupon, isPending } = useUpdateCoupon();

    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountAmount: "",
        minPurchaseAmount: 0,
        maxDiscountAmount: "",
        usageLimitPerUser: 1,
        startDate: "",
        expiryDate: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (couponData?.data) {
            const c = couponData.data;
            setFormData({
                code: c.code,
                discountType: c.discountType,
                discountAmount: c.discountAmount,
                minPurchaseAmount: c.minPurchaseAmount || 0,
                maxDiscountAmount: c.maxDiscountAmount || "",
                usageLimitPerUser: c.usageLimitPerUser || 1,
                startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : "",
                expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : "",
            });
        }
    }, [couponData]);

    const validate = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.code.trim()) {
            newErrors.code = "Coupon code is required";
            valid = false;
        }

        if (!formData.discountAmount || formData.discountAmount <= 0) {
            newErrors.discountAmount = "Discount amount must be strictly greater than 0";
            valid = false;
        }

        if (formData.discountType === "percentage" && formData.discountAmount > 100) {
            newErrors.discountAmount = "Percentage cannot exceed 100";
            valid = false;
        }
        
        if (!formData.startDate) {
            newErrors.startDate = "Start date is required";
            valid = false;
        }

        if (!formData.expiryDate) {
            newErrors.expiryDate = "Expiry date is required";
            valid = false;
        } else if (formData.startDate && new Date(formData.startDate) >= new Date(formData.expiryDate)) {
             newErrors.expiryDate = "Expiry date must be after the start date";
             valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const dataToSubmit = { ...formData };
            if (dataToSubmit.discountType !== "percentage") {
                delete dataToSubmit.maxDiscountAmount;
            }
            if (!dataToSubmit.maxDiscountAmount) {
                delete dataToSubmit.maxDiscountAmount; // Handle empty string clearing for DB
            }

            updateCoupon(
                { id, data: dataToSubmit },
                { onSuccess: () => navigate("/admin/coupons") }
            );
        }
    };

    if (isLoading) return <SpinnerBadge content="Loading coupon details..." />;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Coupon</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code *</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-[#A47F64]"
                        />
                        {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A47F64] focus:border-transparent"
                            />
                            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A47F64] focus:border-transparent"
                            />
                            {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type *</label>
                        <select
                            name="discountType"
                            value={formData.discountType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#A47F64]"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Amount * {formData.discountType === "percentage" ? "(%)" : "(₹)"}
                        </label>
                        <input
                            type="number"
                            name="discountAmount"
                            value={formData.discountAmount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A47F64]"
                        />
                        {errors.discountAmount && <p className="text-red-500 text-sm mt-1">{errors.discountAmount}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase Amount (₹)</label>
                        <input
                            type="number"
                            name="minPurchaseAmount"
                            value={formData.minPurchaseAmount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A47F64]"
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 ${formData.discountType === "percentage" ? "text-gray-700" : "text-gray-400"}`}>
                            Max Discount Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="maxDiscountAmount"
                            value={formData.maxDiscountAmount}
                            onChange={handleChange}
                            disabled={formData.discountType !== "percentage"}
                            placeholder={formData.discountType !== "percentage" ? "N/A for fixed amount" : ""}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A47F64] disabled:bg-gray-100 disabled:text-gray-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit Per User</label>
                        <input
                            type="number"
                            name="usageLimitPerUser"
                            min="1"
                            value={formData.usageLimitPerUser}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A47F64]"
                        />
                    </div>
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
                        {isPending ? "Updating..." : "Update Coupon"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCoupon;
