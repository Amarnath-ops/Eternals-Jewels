import z from "zod";

const variantSchema = z.object({
    material: z.string().trim().min(1, "Material is required"),
    quantity: z.coerce.number().min(0, "Quantity must be non-negative"),
    regularPrice: z.coerce.number().min(0.01, "Regular price must be greater than 0"),
    salePrice: z.coerce.number().min(0, "Sale price must be non-negative"),
    sku: z.string().trim().min(1, "SKU is required"),
    images: z.array(z.object({
        image_url: z.string(),
        publicId: z.string(),
    })).optional(),
}).superRefine((data, ctx) => {
    if (data.salePrice > data.regularPrice) {
        ctx.addIssue({
            path: ["salePrice"],
            message: "Sale price cannot be greater than regular price",
        });
    }
});

export const addProductSchema = z.object({
    productName: z.string().trim().min(3, "Name must be at least 3 characters").max(100),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Category is required"),
    // Variants comes as a JSON string from FormData usually, so we might need to parse it in controller or here.
    // Assuming controller parses it to object before validation if using validateData utility.
    // Use z.preprocess if coming as string, but standard practice handling in controller is better if generic.
    // However, keeping it simple:
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
    isListed: z.coerce.boolean().optional(),
    variantImageMappings: z.array(z.array(z.number())).optional(),
});

export const updateProductSchema = addProductSchema.partial();
