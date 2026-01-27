import z from "zod";
import { fullnameSchema, phoneSchema } from "./common.schema";

export const addressSchema = z.object({
    fullname: fullnameSchema,
    phone:phoneSchema,
    address: z
        .string()
        .trim()
        .min(8, { message: "Must be between 8 and 200 characters long." })
        .max(200, { message: "Must be between 8 and 200 characters long." }),
    district: z
        .string()
        .trim()
        .min(2, "District must be at least 2 characters")
        .max(50, "District is too long")
        .regex(/^[A-Za-z\s]+$/, "District must contain only letters").regex(/^[A-Za-z\s]+$/, "must contain only letters"),
    state: z
        .string()
        .trim()
        .min(2, "State must be at least 2 characters")
        .max(50, "State is too long")
        .regex(/^[A-Za-z\s]+$/, "State must contain only letters").regex(/^[A-Za-z\s]+$/, "must contain only letters"),
    city: z
        .string()
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(50, "City is too long")
        .regex(/^[A-Za-z\s]+$/, "City must contain only letters").regex(/^[A-Za-z\s]+$/, "must contain only letters"),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Pin code must be a valid 6-digit Indian PIN"),
    landmark: z.string().trim().max(100, "Landmark is too long").optional(),
    isDefault: z.boolean(),
});
