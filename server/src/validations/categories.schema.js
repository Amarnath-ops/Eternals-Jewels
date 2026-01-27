import z from "zod";
export const addCategorySchema = z
    .object({
        categoryOffer: z.coerce.number().min(0, "Discount must be at least 1%.").max(90, "Discount cannot exceed 90%."),
        maxRedeem: z.coerce.number().min(0, "Max redeem cannot be negative."),
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
    })
    .superRefine((data, ctx) => {
        const { categoryOffer, maxRedeem } = data;

        if (categoryOffer === 0 && maxRedeem !== 0) {
            ctx.addIssue({
                path: ["maxRedeem"],
                message: "Max redeem must be 0 when no offer is applied",
            });
        }

        if (categoryOffer > 0 && maxRedeem <= 0) {
            ctx.addIssue({
                path: ["maxRedeem"],
                message: "Max redeem must be greater than 0 when offer is applied",
            });
        }
    });


export const updateCategorySchema = z
    .object({
        categoryOffer: z.coerce.number().min(0, "Discount must be at least 1%.").max(90, "Discount cannot exceed 90%."),
        maxRedeem: z.coerce.number().min(0, "Max redeem cannot be negative."),
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
            .max(200, { message: "Must be between 8 and 200 characters long." }),
    })
    .superRefine((data, ctx) => {
        const { categoryOffer, maxRedeem } = data;

        if (categoryOffer === 0 && maxRedeem !== 0) {
            ctx.addIssue({
                path: ["maxRedeem"],
                message: "Max redeem must be 0 when no offer is applied",
            });
        }

        if (categoryOffer > 0 && maxRedeem <= 0) {
            ctx.addIssue({
                path: ["maxRedeem"],
                message: "Max redeem must be greater than 0 when offer is applied",
            });
        }
    });
