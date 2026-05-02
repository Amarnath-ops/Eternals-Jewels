import z from "zod";

const variantSchema = z.object({
    _id: z.string().optional(),
    material: z.string().trim().min(3, "Material is required (min 3)").max(30),
    quantity: z.coerce.number().min(0, "Quantity must be non-negative"),
    regularPrice: z.coerce.number().min(0.01, "Regular price must be greater than 0"),
    salePrice: z.coerce.number().min(0).optional(),
    sku: z.string().trim().min(3, "SKU is required (min 3)").max(30),
    images: z.array(z.object({
        image_url: z.string(),
        publicId: z.string(),
    })).optional(),
}).superRefine((data, ctx) => {
    if (data.salePrice && data.salePrice > data.regularPrice) {
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
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
    isListed: z.coerce.boolean().optional(),
    variantImageMappings: z.array(z.array(z.number())).optional(),
    offer: z.string().nullable().optional(),
});

export const updateProductSchema = addProductSchema.partial();
