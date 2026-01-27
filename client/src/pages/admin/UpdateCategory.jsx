import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Image, ChevronRight } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import useZodForm from "@/hooks/useZodForm";
import FormWrapper from "@/components/form/Form";
import { updateCategorySchema } from "@/validations/category.schema";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImage } from "@/lib/cropUtils";
import FormInput from "@/components/form/FormInput";
import { SpinnerBadge } from "@/components/Spinner";
import { useUpdateCategory } from "@/hooks/tanstack_Queries/admin/categories/useUpdateCategory";
const UpdateCategory = () => {
    const {categoryId} = useParams()
    const {state:{category}} = useLocation()    
    const [preview, setPreview] = useState(null);
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ unit: "%", width: 40, aspect: 1 });
    const [completedCrop, setCompletedCrop] = useState(null);

    const imageInputRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    const { mutateAsync, isPending } = useUpdateCategory();

    const {
        handleSubmit,
        register,
        setError,
        setValue,
        formState: { errors , isDirty},
        reset,
    } = useZodForm(updateCategorySchema, {
        defaultValues: {
            categoryName: "",
            categoryDescription: "",
            categoryOffer: "",
            maxRedeem: "",
            isListed: true,
            thumbnail: null,
        },
    });

    useEffect(() => {
        if (!category) return;
        reset({
            categoryName: category.categoryName || "",
            categoryDescription: category.categoryDescription || "",
            categoryOffer: category.categoryOffer || "",
            maxRedeem: category.maxRedeem || "",
            thumbnail: null, 
        },{
            keepDirty:false
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreview(category?.thumbnail?.image_url)
    }, [ category, reset]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            console.log(data);
            if (data.thumbnail) {
                formData.append("thumbnail", data.thumbnail);
            }
            formData.append("categoryName", data.categoryName);
            formData.append("categoryDescription", data.categoryDescription);
            formData.append("categoryOffer", data.categoryOffer);
            formData.append("maxRedeem", data.maxRedeem);
            await mutateAsync({ categoryId, data: formData });
        } catch (error) {
            console.log(error);
        }
    };

    const handleFile = (file) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("thumbnail", { message: "Please upload an image file." });
            return;
        }
        setSrc(URL.createObjectURL(file));
    };
    const handleDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleInputImage = (file) => {
        handleFile(file);
    };
    const handleImageInputClick = () => {
        imageInputRef.current.click();
    };

    const handleCropImage = async () => {
        const croppedFile = await getCroppedImage(imgRef.current, completedCrop, canvasRef.current);
        if (croppedFile) {
            const previewURL = URL.createObjectURL(croppedFile);
            setPreview(previewURL);
            setValue("thumbnail", croppedFile, { shouldValidate: true , shouldDirty:true});
            setSrc(null);
        }
    };

    const handleEdit = () => {
        setPreview(null);
            setSrc(null);
        handleImageInputClick();
    };

    return (
        <div className="flex-1 bg-white min-h-screen p-4 md:p-8 font-sans">
            {/* --- Main Container with Max Width --- */}
            <div className="max-w-4xl mx-auto w-full">
                {/* --- Header Section --- */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">UPDATE A CATEGORY</h1>
                    <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-500">
                        <Link to="/admin/categories" className="hover:text-gray-800">
                            Category
                        </Link>
                        <ChevronRight size={16} className="mx-1" />
                        <span className="text-gray-900 font-medium">Update Category</span>
                    </div>
                </div>

                <FormWrapper onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <div className="mb-6 md:mb-8">
                        <label className="block text-gray-600 mb-2 font-medium">Category thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={imageInputRef}
                            hidden
                            onChange={(e) => handleInputImage(e.target.files[0])}
                        />

                        {/* Responsive Drop Zone Container */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className="border-2 w-full border-dashed border-gray-200 rounded-lg bg-[#F8F9FE] min-h-62.5 flex flex-col items-center justify-center text-center p-6 transition-colors hover:bg-gray-50"
                        >
                            {/* --- Crop Modal (Overlay) --- */}
                            {src && !preview && (
                                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white p-4 rounded-xl w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto flex flex-col">
                                        <h2 className="text-lg font-semibold mb-3">Crop category image</h2>

                                        <div className="flex justify-center bg-gray-100 rounded-lg p-2 overflow-hidden">
                                            <ReactCrop
                                                crop={crop}
                                                onChange={(c) => setCrop(c)}
                                                onComplete={(c) => setCompletedCrop(c)}
                                                aspect={1}
                                                className="max-h-[60vh]"
                                            >
                                                <img
                                                    src={src}
                                                    ref={imgRef}
                                                    alt="Crop target"
                                                    className="max-h-[60vh] w-auto object-contain max-w-full"
                                                />
                                            </ReactCrop>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-4">
                                            <button
                                                type="button"
                                                onClick={() => setSrc(null)}
                                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition text-sm font-medium"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleCropImage}
                                                className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition text-sm font-medium"
                                            >
                                                Crop Image
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- Preview State --- */}
                            {preview ? (
                                <div className="flex flex-col items-center w-full">
                                    <div className="w-full max-w-sm aspect-square overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleEdit}
                                        className="mt-4 bg-black text-white px-6 py-2 rounded-lg font-semibold  hover:bg-gray-800 transition"
                                    >
                                        Change Image
                                    </button>
                                </div>
                            ) : (
                                /* --- Empty State --- */
                                <>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 text-purple-500">
                                        <Image size={24} />
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 px-4">
                                        Drag and drop image here, or click add image
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleImageInputClick}
                                        className="bg-[#E0E7FF] text-indigo-600 px-6 py-2 rounded text-sm font-medium hover:bg-indigo-100 transition"
                                    >
                                        Add Image
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {errors.thumbnail && <p className="text-red-500 text-xs mt-1 w-full">{errors.thumbnail.message}</p>}
                    {/* --- Form Fields --- */}
                    <div className="space-y-6">
                        {/* Offer & Redeemable Row */}
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                                <label className="text-gray-900 font-medium text-base whitespace-nowrap">
                                    Category Offer:
                                </label>
                                <FormInput
                                    name="categoryOffer"
                                    register={register}
                                    type="number"
                                    min="0"
                                    step="1"
                                    error={errors.categoryOffer}
                                    onWheel={(e) => e.target.blur()}
                                    className="bg-gray-200 rounded px-3 py-2 w-full sm:w-32 outline-none focus:ring-2 focus:ring-gray-400 transition"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                                <label className="text-gray-900 font-medium text-base whitespace-nowrap">
                                    Max Redeemable:
                                </label>
                                <FormInput
                                    name="maxRedeem"
                                    register={register}
                                    error={errors.maxRedeem}
                                    type="number"
                                    min="0"
                                    step="1"
                                    onWheel={(e) => e.target.blur()}
                                    className="bg-gray-200 rounded px-3 py-2 w-full sm:w-32 outline-none focus:ring-2 focus:ring-gray-400 transition"
                                />
                            </div>
                        </div>

                        {/* Category Name */}
                        <div>
                            <label className="block text-gray-600 mb-2 font-medium">Category Name</label>
                            <FormInput
                                name="categoryName"
                                register={register}
                                error={errors.categoryName}
                                type="text"
                                placeholder="Type category name here..."
                                className="w-full bg-[#F5F6FA] border-none rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-600 mb-2 font-medium">Description</label>
                            <textarea
                                {...register("categoryDescription")}
                                placeholder="Type category description here..."
                                rows="6"
                                className="w-full bg-[#F5F6FA] border-none rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400 resize-none"
                            ></textarea>
                            {errors.categoryDescription && (
                                <p className="text-red-500 text-xs mt-1 w-full">{errors.categoryDescription.message}</p>
                            )}
                        </div>
                    </div>

                    {/* --- Action Button --- */}
                    <div className="mt-8 md:mt-10 flex justify-center md:justify-end pb-8">
                        <button
                            disabled={!isDirty || isPending}
                            type="submit"
                            className={`${!isDirty&& "cursor-not-allowed"} w-full md:w-auto bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition shadow-lg`}
                        >
                            {isPending ? "Updating..." : "Update Category"}
                        </button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </FormWrapper>
            </div>
        </div>
    );
};

export default UpdateCategory;
