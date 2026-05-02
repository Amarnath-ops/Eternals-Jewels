import { z } from "zod";

export const couponSchema = z.object({
    code: z.string().trim()
        .min(3, "Coupon code must be at least 3 characters")
        .toUpperCase(),
    discountType: z.enum(["percentage", "fixed"], {
        errorMap: () => ({ message: "Please select a discount type" }),
    }),
    discountAmount: z.coerce.number()
        .min(1, "Discount amount must be at least 1"),
    minPurchaseAmount: z.coerce.number()
        .min(0, "Minimum purchase amount cannot be negative"),
    maxDiscountAmount: z.coerce.number()
        .min(1, "Max discount amount must be at least 1")
        .nullable()
        .optional()
        .or(z.literal("")),
    startDate: z.string().min(1, "Start date is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    usageLimitPerUser: z.coerce.number().min(1, "Usage limit must be at least 1"),
}).refine((data) => {
    if (data.discountType === "percentage") {
        return data.discountAmount <= 100;
    }
    return true;
}, {
    message: "Percentage discount cannot exceed 100%",
    path: ["discountAmount"],
}).refine((data) => {
    if (data.discountType === "fixed") {
        return data.discountAmount < data.minPurchaseAmount;
    }
    return true;
}, {
    message: "Fixed discount must be less than minimum purchase amount",
    path: ["discountAmount"],
}).refine((data) => {
    if (data.startDate && data.expiryDate) {
        return new Date(data.startDate) < new Date(data.expiryDate);
    }
    return true;
}, {
    message: "Expiry date must be after start date",
    path: ["expiryDate"],
});
