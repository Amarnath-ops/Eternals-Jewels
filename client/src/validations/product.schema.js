import z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const imageFileSchema = z
    .any()
    .refine((files) => files instanceof FileList, {
        message: "Images are required.",
    })
    .refine((files) => files.length >= 3, {
        message: "At least 3 images is required.",
    })
    .refine((files) => files.length <= 4, {
        message: "Only 4 images are allowed."
    })
    .refine((files) => Array.from(files).every((file) => file.type.startsWith("image/")), {
        message: "Only image files are allowed.",
    })
    .refine((files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE), {
        message: "Each image must be less than 2MB.",
    });

const variantSchema = z
    .object({
        material: z.string().trim().min(3, "Material must be at least 3 chars"),
        quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
        regularPrice: z.coerce.number().min(0.01, { message: "Price must be greater than 0." }),
        salePrice: z.coerce.number().min(0).optional(),
        sku: z.string().trim().min(3, "SKU must be at least 3 chars"),
        images: imageFileSchema.optional(),
    })
    .superRefine((data, ctx) => {
        if (data.salePrice && data.salePrice > data.regularPrice) {
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
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
    isListed: z.coerce.boolean(),
    offer: z.string().nullable().optional(),
});

export const updateProductSchema = addProductSchema.partial().extend({
    variants: z.any(),
});
