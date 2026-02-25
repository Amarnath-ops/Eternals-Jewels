import { z } from "zod";

export const offerSchema = z.object({
    offerName: z.string().trim()
        .min(3, "Offer name must be at least 3 characters")
        .max(50, "Offer name cannot exceed 50 characters"),
    offerType: z.enum(["Product", "Category"], {
        errorMap: () => ({ message: "Please select an offer type" }),
    }),
    discountPercentage: z.coerce
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100%"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    isActive: z.boolean().default(true),
}).refine((data) => {
    return new Date(data.startDate) < new Date(data.endDate);
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});
