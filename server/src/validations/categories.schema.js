import z from "zod";

export const addCategorySchema = z.object({
    categoryOffer: z.coerce.number().min(0).max(90).optional(),
    maxRedeem: z.coerce.number().min(0).optional(),
    categoryName: z
        .string()
        .trim()
        .min(3, { message: "Must be between 4 and 15 characters long." })
        .max(15, { message: "Must be between 4 and 15 characters long." })
        .regex(/^[A-Za-z\s]+$/, "must contain only letters"),
    categoryDescription: z
        .string()
        .trim()
        .min(8, { message: "Must be between 8 and 200 characters long." })
        .max(600, { message: "Must be between 8 and 600 characters long." }),
    isListed: z.coerce.boolean(),
    offer: z.string().nullable().optional(),
});

export const updateCategorySchema = addCategorySchema.partial();
