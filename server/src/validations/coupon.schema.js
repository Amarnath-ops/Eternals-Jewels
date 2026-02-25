import { z } from "zod";

export const couponSchema = z.object({
    code: z.string().trim().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
    discountType: z.enum(["percentage", "fixed"]),
    discountAmount: z.coerce.number().positive("Discount amount must be greater than 0"),
    minPurchaseAmount: z.coerce.number().min(0, "Minimum purchase amount cannot be negative").default(0),
    maxDiscountAmount: z.coerce.number().positive("Max discount amount must be greater than 0").nullable().optional(),
    startDate: z.coerce.date({
        required_error: "Start date is required",
        invalid_type_error: "Invalid start date",
    }),
    expiryDate: z.coerce.date({
        required_error: "Expiry date is required",
        invalid_type_error: "Invalid expiry date",
    }),
    usageLimitPerUser: z.coerce.number().min(1, "Usage limit must be at least 1").default(1),
}).refine((data) => {
    if (data.discountType === "percentage") {
        return data.discountAmount <= 100;
    }
    return true;
}, {
    message: "Percentage discount cannot exceed 100%",
    path: ["discountAmount"],
}).refine((data) => {
    return data.expiryDate > data.startDate;
}, {
    message: "Expiry date must be after start date",
    path: ["expiryDate"],
});

export const updateCouponSchema = couponSchema.partial();
