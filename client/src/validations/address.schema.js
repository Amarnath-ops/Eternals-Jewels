import z from "zod";

export const addressSchema = z.object({
    fullname: z
        .string()
        .trim()
        .min(3, { message: "Must be between 4 and 15 characters long." })
        .max(15, { message: "Must be between 4 and 15 characters long." }),
    phone: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits." }),
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
        .regex(/^[A-Za-z\s]+$/, "District must contain only letters"),
    state: z
        .string()
        .trim()
        .min(2, "State must be at least 2 characters")
        .max(50, "State is too long")
        .regex(/^[A-Za-z\s]+$/, "State must contain only letters"),
    city: z
        .string()
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(50, "City is too long")
        .regex(/^[A-Za-z\s]+$/, "City must contain only letters"),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Pin code must be a valid 6-digit Indian PIN"),
    landmark: z.string().trim().max(100, "Landmark is too long").optional(),
    isDefault:z.boolean()
});
