import React, { useEffect, useRef, useState } from "react";
import { Image, ChevronRight, X, Plus, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import useZodForm from "@/hooks/useZodForm";
import { updateProductSchema } from "@/validations/product.schema";
import FormWrapper from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";
import { useUpdateProduct } from "@/hooks/tanstack_Queries/admin/products/useUpdateProduct";
import { useGetProductById } from "@/hooks/tanstack_Queries/admin/products/useGetProductById";
import { useGetCategories } from "@/hooks/tanstack_Queries/admin/categories/useGetCategories";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImage } from "@/lib/cropUtils";
import { useFieldArray } from "react-hook-form";
import { SpinnerBadge } from "@/components/Spinner";

const EditProduct = () => {
    const { id } = useParams();
    const [status, setStatus] = useState("Listed");
    const [preview, setPreview] = useState(null);
    const [src, setSrc] = useState(null);
    const [crop, setCrop] = useState({ unit: "%", width: 50, aspect: 1 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const imageInputRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);

    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState([]);
    const galleryInputRef = useRef(null);

    const { data: productData, isLoading: isLoadingProduct } = useGetProductById(id);
    const { mutateAsync: updateProduct, isPending } = useUpdateProduct();
    const { data: categoriesData } = useGetCategories({ page: 1, limit: 100, sort: "categoryName" });

    const {
        handleSubmit,
        register,
        setError,
        setValue,
        control,
        watch,
        reset,
        formState: { errors },
    } = useZodForm(updateProductSchema, {
        defaultValues: {
            variants: [],
            isListed: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    useEffect(() => {
        if (productData) {
            reset({
                productName: productData.productName,
                description: productData.description,
                category: productData.category?._id || productData.category,
                isListed: productData.isListed,
                variants: productData.variants,
            });
            setStatus(productData.isListed ? "Listed" : "Unlisted");
            
            if (productData.thumbnail?.image_url) {
                setPreview(productData.thumbnail.image_url);
                setValue("thumbnail", "EXISTING_IMAGE");
            }

            if (productData.productImages) {
                setExistingGalleryImages(productData.productImages);
                setGalleryPreviews(productData.productImages.map(img => img.image_url));
            }
        }
    }, [productData, reset, setValue]);

    
    const [activeCropIndex, setActiveCropIndex] = useState(null);

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("thumbnail", { message: "Please upload an image file." });
            return;
        }
        setSrc(URL.createObjectURL(file));
        setActiveCropIndex(null);
    };

    const handleCropImage = async () => {
        const croppedFile = await getCroppedImage(imgRef.current, completedCrop, canvasRef.current);
        if (croppedFile) {
            const previewURL = URL.createObjectURL(croppedFile);
            
            if (activeCropIndex === null) {
                 setPreview(previewURL);
                 setValue("thumbnail", croppedFile, { shouldValidate: true });
            } else {
                const currentFiles = watch("productImages") || [];
                const newFiles = [...currentFiles];
                newFiles[activeCropIndex] = croppedFile;
                setValue("productImages", newFiles, { shouldValidate: true });
            }
           
            setSrc(null);
            setActiveCropIndex(null);
        }
    };

    const handleEditThumbnail = () => {
        setPreview(null);
        setValue("thumbnail", null); 
        setSrc(null);
        setActiveCropIndex(null);
        imageInputRef.current.click();
    };

    const handleCropNewGalleryImage = (index) => {
        const currentFiles = watch("productImages") || [];
        const file = currentFiles[index];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setSrc(fileUrl);
            setActiveCropIndex(index);
        }
    };

    const handleGalleryFiles = (files) => {
        if (!files || files.length === 0) return;
        
        const currentNewFiles = Array.isArray(watch("productImages")) ? watch("productImages") : []; 
        
        const validFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
        
        const totalCount = existingGalleryImages.length + currentNewFiles.length + validFiles.length;

        if (totalCount > 4) {
             setError("productImages", { message: "Maximum 4 images total allowed." });
             return;
        }

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]); 
        
        const combinedFiles = [...currentNewFiles, ...validFiles]; 
        
        setValue("productImages", combinedFiles, { shouldValidate: true });

        if (validFiles.length > 0) {
            const lastFile = validFiles[validFiles.length - 1]; 
            const lastIndex = combinedFiles.length - 1;
            setSrc(URL.createObjectURL(lastFile));
            setActiveCropIndex(lastIndex);
        }
    };

    const removeGalleryImage = (index) => {
        return;
    };

    const removeExistingImage = (publicId) => {
        const newList = existingGalleryImages.filter(img => img.publicId !== publicId);
        setExistingGalleryImages(newList);
    };

    const removeNewImage = (index) => {
        const currentFiles = watch("productImages") || [];
        const newFiles = currentFiles.filter((_, i) => i !== index);
        setValue("productImages", newFiles, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        try {
            const totalImages = existingGalleryImages.length + (data.productImages?.length || 0);
            if (totalImages < 2) {
                setError("productImages", { message: "At least 2 additional images are required" });
                return;
            }

            const formData = new FormData();
            formData.append("productName", data.productName);
            formData.append("description", data.description);
            formData.append("category", data.category);
            formData.append("isListed", data.isListed);
            
            if (data.thumbnail instanceof File) {
                formData.append("thumbnail", data.thumbnail);
            }

            existingGalleryImages.forEach(img => {
                formData.append("existingImages", img.publicId);
            });

            if (data.productImages && Array.isArray(data.productImages)) {
                data.productImages.forEach((file) => {
                    if (file instanceof File) {
                        formData.append("productImages", file);
                    }
                });
            }

            formData.append("variants", JSON.stringify(data.variants));

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
                                                setValue("isListed", true);
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
                                                setValue("isListed", false);
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
                        <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Product Image</h2>
                        
                        <div className="mb-8">
                            <p className="text-gray-600 font-medium mb-3">Main Photo</p>
                            <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={(e) => handleFile(e.target.files[0])} />
                            
                            {src && (
                                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white p-4 rounded-xl w-full max-w-2xl shadow-lg flex flex-col max-h-[90vh]">
                                        <h3 className="text-lg font-bold mb-4">Crop Image</h3>
                                        <div className="flex-1 overflow-auto flex justify-center bg-gray-100 rounded p-4">
                                            <ReactCrop crop={crop} onChange={setCrop} onComplete={setCompletedCrop} aspect={1}>
                                                <img ref={imgRef} src={src} alt="Crop target" className="max-w-full" />
                                            </ReactCrop>
                                        </div>
                                        <div className="flex justify-end gap-3 mt-4">
                                            <button type="button" onClick={() => setSrc(null)} className="px-4 py-2 bg-gray-200 rounded text-sm hover:bg-gray-300">Cancel</button>
                                            <button type="button" onClick={handleCropImage} className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800">Crop & Save</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {preview ? (
                                <div className="relative w-full md:w-1/2 aspect-video bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
                                     <img src={preview} alt="Thumbnail" className="w-full h-full object-contain" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                         <button type="button" onClick={handleEditThumbnail} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100">Change Image</button>
                                     </div>
                                </div>
                            ) : (
                                <div onClick={() => imageInputRef.current.click()} className="w-full md:w-1/2 aspect-video bg-[#Fbfbfe] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                                    <div className="bg-[#ecedfd] p-3 rounded-lg text-[#5d60ef] mb-3">
                                        <Image size={24} />
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">Drag and drop image here, or click add image</p>
                                    <button type="button" className="bg-[#ecedfd] text-[#5d60ef] px-4 py-2 rounded-lg text-sm font-bold">Add Image</button>
                                </div>
                            )}
                            {errors.thumbnail && !preview && <p className="text-red-500 text-xs mt-2">{errors.thumbnail.message}</p>}
                        </div>

                        <div>
                            <p className="text-gray-600 font-medium mb-3">Additional (Max 4)</p>
                            <input type="file" ref={galleryInputRef} hidden accept="image/*" multiple onChange={(e) => handleGalleryFiles(e.target.files)} />
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {existingGalleryImages.map((img) => (
                                    <div key={img.publicId} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                         <img src={img.image_url} alt="Existing" className="w-full h-full object-cover" />
                                         <button 
                                            type="button" 
                                            onClick={() => removeExistingImage(img.publicId)} 
                                            className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-red-500 hover:bg-white transition opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {Array.isArray(watch("productImages")) && watch("productImages").map((file, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                                         <img src={URL.createObjectURL(file)} alt="New" className="w-full h-full object-cover" />
                                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                             <button 
                                                type="button" 
                                                onClick={() => handleCropNewGalleryImage(idx)}
                                                className="bg-white p-1.5 rounded-full text-gray-700 hover:text-black hover:bg-gray-100 transition"
                                                title="Crop Image"
                                            >
                                                <Image size={16} />
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => removeNewImage(idx)} 
                                                className="bg-white p-1.5 rounded-full text-red-500 hover:bg-red-50 transition"
                                                title="Remove Image"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                         </div>
                                    </div>
                                ))}

                                {(existingGalleryImages.length + (Array.isArray(watch("productImages")) ? watch("productImages").length : 0)) < 4 && (
                                     <div onClick={() => galleryInputRef.current.click()} className="aspect-square bg-[#Fbfbfe] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                                        <div className="bg-[#ecedfd] p-2 rounded-lg text-[#5d60ef] mb-2">
                                            <Plus size={20} />
                                        </div>
                                        <p className="text-xs text-center text-gray-400 px-2">Click to add</p>
                                    </div>
                                )}
                            </div>
                            {errors.productImages && <p className="text-red-500 text-xs mt-2">{errors.productImages.message}</p>}
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
                                        <button type="button" onClick={() => remove(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
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
                            disabled={isPending}
                            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "UPDATING..." : "UPDATE PRODUCT"}
                        </button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </FormWrapper>
            </div>
        </div>
    );
};

export default EditProduct;
