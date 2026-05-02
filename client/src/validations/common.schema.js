import z from "zod";

export const imageSchema = z
    .any()
    .refine((file) => !file || file instanceof File, "Invalid file.")
    .refine(
        (file) => !file || ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type),
        "Only image files are allowed (jpg, jpeg, png, webp).",
    )
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Image must be less than 2MB.");

export const emailSchema = z
    .email({ message: "Invalid email address. Please check the format." })
    .trim({ message: "Invalid email address. Please check the format." })
    .min(1, { message: "Email cannot be empty." })
    .lowercase({ message: "Invalid email address. Please check the format." })
    .max(50, { message: "Email address is too long." });

export const fullnameSchema = z
    .string()
    .trim()
    .min(3, { message: "Must be between 4 and 15 characters long." })
    .max(15, { message: "Must be between 4 and 15 characters long." })
    .regex(/^[A-Za-z\s]+$/, "must contain only letters");

export const phoneSchema = z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits." });

export const passwordSchema = z
    .string()
    .trim()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,15}$/, {
        message:
            "Password must be 4-15 characters and contain an uppercase letter, lowercase letter, number, and special character.",
    });

export const confirmPasswordSchema = z.string().trim().min(1, { message: "Confirm password cannot be empty." });
