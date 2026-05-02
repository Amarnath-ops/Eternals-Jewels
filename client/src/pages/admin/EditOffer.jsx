import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader } from "lucide-react";
import { useUpdateOffer } from "@/hooks/tanstack_Queries/admin/offer/useOfferMutations";
import { useGetOfferById } from "@/hooks/tanstack_Queries/admin/offer/useGetOfferById";
import { offerSchema } from "@/validations/offer.schema";
import useZodForm from "@/hooks/useZodForm";
import FormInput from "@/components/form/FormInput";

const EditOffer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: offerResponse, isLoading: isLoadingOffer } = useGetOfferById(id);
    const { mutate: updateOffer, isPending: isUpdating } = useUpdateOffer();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useZodForm(offerSchema, {
        defaultValues: {
            offerName: "",
            offerType: "Product",
            discountPercentage: 0,
            startDate: "",
            endDate: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (offerResponse?.data) {
            const offer = offerResponse.data;
            reset({
                offerName: offer.offerName || "",
                offerType: offer.offerType || "Product",
                discountPercentage: offer.discountPercentage || 0,
                startDate: offer.startDate ? offer.startDate.split('T')[0] : "",
                endDate: offer.endDate ? offer.endDate.split('T')[0] : "",
                isActive: offer.isActive ?? true,
            });
        }
    }, [offerResponse, reset]);

    const onSubmit = (data) => {
        updateOffer({ id, data }, {
            onSuccess: () => navigate("/admin/offers"),
        });
    };

    if (isLoadingOffer) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader className="animate-spin text-[#A47F64]" size={40} />
            </div>
        );
    }

    const inputClasses = "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#A47F64] outline-none transition-colors border-gray-300";

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button
                onClick={() => navigate("/admin/offers")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back to Offers</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Offer</h1>
                    <p className="text-gray-500 text-sm mt-1">Update the discount profile details.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Offer Name*"
                            name="offerName"
                            register={register}
                            error={errors.offerName}
                            placeholder="e.g. Summer Sale 10%"
                            className={`${inputClasses} ${errors.offerName ? "border-red-500 bg-red-50" : ""}`}
                        />

                        <FormInput
                            label="Discount Percentage (%)*"
                            type="number"
                            name="discountPercentage"
                            register={register}
                            error={errors.discountPercentage}
                            placeholder="0 - 100"
                            className={`${inputClasses} ${errors.discountPercentage ? "border-red-500 bg-red-50" : ""}`}
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Offer Type*</label>
                            <select
                                {...register("offerType")}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#A47F64] outline-none bg-white transition-colors ${
                                    errors.offerType ? "border-red-500 bg-red-50" : "border-gray-300"
                                }`}
                            >
                                <option value="Product">Product Offer</option>
                                <option value="Category">Category Offer</option>
                            </select>
                            {errors.offerType && <p className="text-xs text-red-500 font-medium">{errors.offerType.message}</p>}
                        </div>

                        <div className="hidden md:block"></div>

                        <FormInput
                            label="Starting Date*"
                            type="date"
                            name="startDate"
                            register={register}
                            error={errors.startDate}
                            className={`${inputClasses} ${errors.startDate ? "border-red-500 bg-red-50" : ""}`}
                        />

                        <FormInput
                            label="Ending Date*"
                            type="date"
                            name="endDate"
                            register={register}
                            error={errors.endDate}
                            className={`${inputClasses} ${errors.endDate ? "border-red-500 bg-red-50" : ""}`}
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <input
                            type="checkbox"
                            {...register("isActive")}
                            id="isActive"
                            className="h-5 w-5 rounded border-gray-300 text-[#A47F64] focus:ring-[#A47F64] cursor-pointer"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Active immediately
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/offers")}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex items-center gap-2 bg-[#A47F64] text-white px-8 py-2 rounded-lg hover:bg-[#8B6D51] transition-colors font-bold disabled:opacity-50 shadow-md"
                        >
                            {isUpdating ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Save size={20} />
                            )}
                            <span>Update Offer</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOffer;
