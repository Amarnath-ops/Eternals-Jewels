import z from "zod";

export const offerSchema = z.object({
    offerName: z.string().trim().min(3, "Offer name must be at least 3 characters").max(50),
    offerType: z.enum(["Product", "Category"], {
        errorMap: () => ({ message: "Offer type must be either Product or Category" }),
    }),
    discountPercentage: z.coerce
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100%"),
    startDate: z.coerce.date({
        required_error: "Start date is required",
        invalid_type_error: "Invalid start date",
    }),
    endDate: z.coerce.date({
        required_error: "End date is required",
        invalid_type_error: "Invalid end date",
    }),
    isActive: z.boolean().optional(),
}).refine((data) => {
    return data.endDate > data.startDate;
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});

export const updateOfferSchema = offerSchema.partial();
