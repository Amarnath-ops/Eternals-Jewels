import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, X, Plus, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useZodForm from "@/hooks/useZodForm";
import { updateProductSchema } from "@/validations/product.schema";
import { imageSchema } from "@/validations/common.schema";
import FormWrapper from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";
import { useUpdateProduct } from "@/hooks/tanstack_Queries/admin/products/useUpdateProduct";
import { useGetProductById } from "@/hooks/tanstack_Queries/admin/products/useGetProductById";
import { useGetCategories } from "@/hooks/tanstack_Queries/admin/categories/useGetCategories";
import { useGetActiveOffersByType } from "@/hooks/tanstack_Queries/admin/offer/useGetActiveOffersByType";
import { useFieldArray } from "react-hook-form";
import { SpinnerBadge } from "@/components/Spinner";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImage } from "@/lib/cropUtils";
import toast from "react-hot-toast";
import z from "zod";

const EditProduct = () => {
    const { id } = useParams();
    const [status, setStatus] = useState("Listed");
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ unit: "%", width: 50, aspect: 1 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    
    const [variantImages, setVariantImages] = useState({});
    const [currentVariantIndex, setCurrentVariantIndex] = useState(null);
    const [, setVariantCropQueue] = useState([]);

    const { data: productData, isLoading: isLoadingProduct } = useGetProductById(id);
    const { mutateAsync: updateProduct, isPending } = useUpdateProduct();
    const { data: categoriesData } = useGetCategories({ page: 1, limit: 100, sort: "categoryName" });
    const { data: productOffers } = useGetActiveOffersByType("Product");

    const {
        handleSubmit,
        register,
        setValue,
        setError,
        getValues,
        watch,
        control,
        reset,
        formState: { errors, isDirty },
    } = useZodForm(updateProductSchema, {
        defaultValues: {
            variants: [],
            isListed: true,
            offer: "",
        },
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const watchedVariants = watch("variants");

    useEffect(() => {
        if (productData) {
            reset({
                productName: productData.productName,
                description: productData.description,
                category: productData.category?._id || productData.category,
                isListed: productData.isListed,
                variants: productData.variants,
                offer: productData.offer?._id || productData.offer || "",
            });
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStatus(productData.isListed ? "Listed" : "Unlisted");
            
            
            if (productData.variants) {
                const existingImages = {};
                productData.variants.forEach((variant, idx) => {
                    if (variant.images && variant.images.length > 0) {
                        
                        existingImages[`existing_${idx}`] = variant.images;
                    }
                });
                
            }
        }
    }, [productData, reset, setValue]);

    const handleCropImage = async () => {
        const croppedFile = await getCroppedImage(imgRef.current, completedCrop, canvasRef.current);

        if (!croppedFile) return;

        
        if (currentVariantIndex !== null) {
            const variantIdx = currentVariantIndex;
            const currentImages = variantImages[variantIdx] || [];
            setVariantImages(prev => ({
                ...prev,
                [variantIdx]: [...currentImages, croppedFile]
            }));

            
            setVariantCropQueue(prev => {
                const [, ...rest] = prev;
                if (rest.length > 0) {
                    const next = rest[0];
                    setTimeout(() => {
                        setSrc(URL.createObjectURL(next));
                    }, 0);
                } else {
                    setSrc(null);
                    setCurrentVariantIndex(null);
                }
                return rest;
            });
        }
    };

    const handleRemoveVariant = (index) => {
        
        remove(index);

        
        setVariantImages(prev => {
            const newState = { ...prev };
            
            delete newState[index];
            
            
            
            const shiftedState = {};
            Object.keys(newState).forEach(key => {
                const keyNum = parseInt(key);
                if (keyNum < index) {
                    shiftedState[keyNum] = newState[keyNum];
                } else if (keyNum > index) {
                    shiftedState[keyNum - 1] = newState[keyNum];
                }
            });
            return shiftedState;
        });
    };

    const handleVariantImages = (variantIndex, files) => {
        if (!files || files.length === 0) return;

        const validFiles = [];
        for (const file of files) {
            const result = imageSchema.safeParse(file);
            if (!result.success) {
                const errorMsg = result.error.errors[0].message;
                toast.error(`Error with file ${file.name}: ${errorMsg}`);
                continue;
            }
            validFiles.push(file);
        }
        
        const currentImages = variantImages[variantIndex] || [];
        const existingImages = getValues(`variants.${variantIndex}.images`) || [];
        const totalImages = currentImages.length + existingImages.length + validFiles.length;
        
        if (totalImages > 4) {
            toast.error("Maximum 4 images per variant");
            return;
        }

        setCurrentVariantIndex(variantIndex);
        setVariantCropQueue(validFiles);
        
        if (validFiles.length > 0) {
            setSrc(URL.createObjectURL(validFiles[0]));
        }
    };

    const handleRemoveExistingImage = (variantIndex, imageIndex) => {
        const currentVariants = getValues("variants");
        const currentImages = currentVariants[variantIndex].images || [];
        const updatedImages = currentImages.filter((_, idx) => idx !== imageIndex);
        
        const updatedVariants = [...currentVariants];
        updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            images: updatedImages
        };
        
        setValue("variants", updatedVariants, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    };

    const removeVariantImage = (variantIndex, imageIndex) => {
        setVariantImages(prev => {
            const current = prev[variantIndex] || [];
            return {
                ...prev,
                [variantIndex]: current.filter((_, idx) => idx !== imageIndex)
            };
        });
    };



    const onSubmit = async (data) => {
        try {
            
            const formData = new FormData();
            formData.append("productName", data.productName);
            formData.append("description", data.description);
            formData.append("category", data.category);
            formData.append("isListed", data.isListed);
            for (let i = 0; i < data.variants.length; i++) {
                const existingCount = data.variants[i]?.images?.length || 0;
                const newCount = variantImages[i]?.length || 0;
                const totalCount = existingCount + newCount;
                
                if (totalCount < 3) {
                    setError(`variants.${i}.images`, {
                        message: `Variant ${i + 1} requires at least 3 images (currently has ${totalCount})`,
                    });
                    toast.error(`Variant ${i + 1} requires at least 3 images`);
                    return;
                }
            }

            if (data.offer) {
                formData.append("offer", data.offer);
            }

            
            const variantImageMappings = [];
            Object.entries(variantImages).forEach(([variantIdx, images]) => {
                images.forEach(() => {
                    variantImageMappings.push([parseInt(variantIdx)]);
                });
            });

            Object.values(variantImages).flat().forEach(file => {
                formData.append("variantImages", file);
            });

            if (variantImageMappings.length > 0) {
                formData.append("variantImageMappings", JSON.stringify(variantImageMappings));
            }

            formData.append("variants", JSON.stringify(data.variants));
            console.log(formData)
            await updateProduct({ id, formData });
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoadingProduct) return <div className="flex justify-center items-center h-screen"><SpinnerBadge /></div>;

    return (
        <div className="flex-1 bg-white min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto w-full">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">EDIT PRODUCT</h1>
                    <div className="flex flex-wrap items-center text-xs md:text-sm text-gray-500">
                         <Link to="/admin/products" className="hover:text-gray-800">
                            Products
                        </Link>
                        <ChevronRight size={16} className="mx-1" />
                        <span className="text-gray-900 font-medium">Edit Product</span>
                    </div>
                </div>

                <FormWrapper onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
                    
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 text-gray-800">General Information</h2>
                        
                        <div className="mb-6">
                            <label className="block text-gray-600 mb-2 font-medium">Product Name</label>
                            <FormInput
                                name="productName"
                                register={register}
                                error={errors.productName}
                                placeholder="Type product name here..."
                                className="w-full bg-[#F5F6FA] border-none rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-600 mb-2 font-medium">Description</label>
                            <textarea
                                {...register("description")}
                                placeholder="Type product description here..."
                                rows="4"
                                className="w-full bg-[#F5F6FA] border-none rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 placeholder-gray-400 resize-none"
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div>
                                <label className="block text-gray-600 mb-2 font-medium">Category</label>
                                <select 
                                    {...register("category")}
                                    className="w-full bg-[#F5F6FA] border-none rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer appearance-none"
                                >
                                    <option value="">Select Category</option>
                                    {categoriesData?.categories?.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-600 mb-2 font-medium">Product Offer</label>
                                <select
                                    {...register("offer")}
                                    className="w-full bg-[#F5F6FA] border-none rounded-lg px-4 py-3 text-gray-700 outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer appearance-none"
                                >
                                    <option value="">No Offer</option>
                                    {productOffers?.data?.map((off) => (
                                        <option key={off._id} value={off._id}>
                                            {off.offerName} ({off.discountPercentage}% OFF)
                                        </option>
                                    ))}
                                </select>
                                {errors.offer && <p className="text-red-500 text-xs mt-1">{errors.offer.message}</p>}
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="text-gray-900 font-bold">Should be</span>
                                <div className="flex items-center gap-4">
                                     <label className="flex items-center cursor-pointer gap-2 select-none">
                                        <input
                                            type="radio"
                                            value="Listed"
                                            checked={status === "Listed"}
                                            onChange={() => {
                                                setStatus("Listed");
                                                setValue("isListed", true, { shouldDirty: true });
                                            }}
                                            className="hidden"
                                        />
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${status === "Listed" ? "border-black" : "border-gray-300"}`}>
                                            {status === "Listed" && <div className="w-2 h-2 bg-black rounded-full" />}
                                        </div>
                                        <span className="text-sm font-medium">Listed</span>
                                    </label>
                                     <label className="flex items-center cursor-pointer gap-2 select-none">
                                        <input
                                            type="radio"
                                            value="Unlisted"
                                            checked={status === "Unlisted"}
                                            onChange={() => {
                                                setStatus("Unlisted");
                                                setValue("isListed", false, { shouldDirty: true });
                                            }}
                                            className="hidden"
                                        />
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${status === "Unlisted" ? "border-black" : "border-gray-300"}`}>
                                            {status === "Unlisted" && <div className="w-2 h-2 bg-black rounded-full" />}
                                        </div>
                                        <span className="text-sm font-medium">Unlisted</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Material / Variants</h2>
                            <button type="button" onClick={() => append({ material: "", quantity: 0, salePrice: 0, regularPrice: 0, sku: "" })} className="text-sm flex items-center gap-1 text-[#5d60ef] font-bold hover:underline">
                                <Plus size={16} /> Add Variant
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                             {fields.map((field, index) => (
                                <div key={field.id} className="p-4 bg-gray-50 rounded-xl relative border border-gray-100">
                                    {fields.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 z-10 bg-white rounded-full p-1 shadow-sm">
                                            <X size={18} />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Material</label>
                                            <FormInput name={`variants.${index}.material`} register={register} placeholder="e.g. Gold" className="w-full bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm" error={errors.variants?.[index]?.material} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">SKU</label>
                                            <FormInput name={`variants.${index}.sku`} register={register} placeholder="e.g. SKU-001" className="w-full bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm" error={errors.variants?.[index]?.sku} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Quantity</label>
                                            <FormInput type="number" name={`variants.${index}.quantity`} register={register} className="w-full bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm" error={errors.variants?.[index]?.quantity} />
                                        </div>
                                         <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Regular Price</label>
                                            <FormInput type="number" step="0.01" name={`variants.${index}.regularPrice`} register={register} className="w-full bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm" error={errors.variants?.[index]?.regularPrice} />
                                        </div>
                                         <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Sale Price</label>
                                            <FormInput type="number" step="0.01" name={`variants.${index}.salePrice`} register={register} className="w-full bg-white rounded-lg px-3 py-2 border border-gray-200 text-sm" error={errors.variants?.[index]?.salePrice} />
                                        </div>
                                    </div>

                                    {}
                                    <div className="mt-4">
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                                            Variant Images (3-4 Required)
                                        </label>
                                        <input
                                            type="file"
                                            className="hidden"
                                            multiple
                                            accept="image/*"
                                            id={`variant-images-${index}`}
                                            onClick={(e) => (e.target.value = null)}
                                            onChange={(e) => handleVariantImages(index, e.target.files)}
                                        />
                                        <div className="grid grid-cols-4 gap-3">
                                            {}
                                            {}
                                            {watchedVariants?.[index]?.images?.map((img, imgIdx) => (
                                                <div key={`existing-${imgIdx}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img
                                                        src={img.image_url}
                                                        alt={`Existing ${imgIdx}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded opacity-70 group-hover:opacity-100 transition">
                                                        Existing
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingImage(index, imgIdx)}
                                                        className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-white hover:text-red-600 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            {}
                                            {(variantImages[index] || []).map((file, imgIdx) => (
                                                <div key={imgIdx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Variant ${index} - Image ${imgIdx}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariantImage(index, imgIdx)}
                                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            
                                            {}
                                            {((variantImages[index] || []).length + (watchedVariants?.[index]?.images?.length || 0)) < 4 && (
                                                <label
                                                    htmlFor={`variant-images-${index}`}
                                                    className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                                                >
                                                    <Plus size={20} className="text-gray-400" />
                                                    <span className="text-[10px] text-gray-400 mt-1">Add Image</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.variants && <p className="text-red-500 text-xs mt-3">{errors.variants.message || errors.variants.root?.message}</p>}
                    </div>

                    <div className="flex justify-end pt-4 pb-12 gap-4">
                         <Link to="/admin/products" className="px-8 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition">
                            CANCEL
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending || (!isDirty && !Object.values(variantImages).some(imgs => imgs?.length > 0))}
                            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "UPDATING..." : "UPDATE PRODUCT"}
                        </button>
                    </div>

                    {}
                    {src && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                            <div className="bg-white p-4 rounded-xl w-full max-w-2xl shadow-lg flex flex-col max-h-[90vh]">
                                <h3 className="text-lg font-bold mb-4">Crop Image</h3>
                                <div className="flex-1 overflow-auto flex justify-center bg-gray-100 rounded p-4">
                                    <ReactCrop
                                        crop={crop}
                                        onChange={setCrop}
                                        onComplete={setCompletedCrop}
                                        aspect={1}
                                    >
                                        <img ref={imgRef} src={src} alt="Crop target" className="max-w-full" />
                                    </ReactCrop>
                                </div>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setSrc(null)}
                                        className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCropImage}
                                        className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
                                    >
                                        Crop & Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                </FormWrapper>
            </div>
        </div>
    );
};

export default EditProduct;
