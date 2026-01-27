import z from "zod";
import { imageSchema } from "./common.schema";

const variantSchema = z.object({
    material: z.string().trim().min(1, "Material is required"),
    quantity: z.coerce.number().min(0, "Quantity must be 0 or more"),
    regularPrice: z.coerce.number().min(0.01, "Regular price must be greater than 0"),
    salePrice: z.coerce.number().min(0, "Sale price must be 0 or more"),
    sku: z.string().trim().min(1, "SKU is required"),
}).superRefine((data, ctx) => {
    if (data.salePrice > data.regularPrice) {
        ctx.addIssue({
            path: ["salePrice"],
            message: "Sale price cannot be greater than regular price",
        });
    }
});

export const addProductSchema = z.object({
    productName: z.string().trim().min(3, "Name must be at least 3 characters").max(100, "Name too long"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    thumbnail: imageSchema, // Reusing imageSchema which allows File
    productImages: z.array(z.any())
        .min(2, "At least 2 additional images are required")
        .max(4, "Maximum 4 images allowed")
        .refine((files) => {
             if (!files) return true;
             return files.every(file => file instanceof File && ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type) && file.size <= 5 * 1024 * 1024);
        }, "Invalid image files (Max 5MB, images only)"),
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
    isListed: z.coerce.boolean(),
});

export const updateProductSchema = z.object({
    productName: z.string().trim().min(3, "Name must be at least 3 characters").max(100, "Name too long"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    thumbnail: z.any().optional(), // Can be null or File
    // For update, productImages might be mixed or just new files. Logic handled in component, schema validates individual new files if present.
    productImages: z.array(z.any()).max(4).optional(),
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
    isListed: z.coerce.boolean(),
    // existingImages not validated here, passed manually or separate
});
