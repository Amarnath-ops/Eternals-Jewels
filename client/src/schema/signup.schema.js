import { z } from "zod";

export const signupSchema = z
    .object({
        fullname: z
            .string()
            .trim()
            .min(3, { message: "Must be between 4 and 15 characters long." })
            .max(15, { message: "Must be between 4 and 15 characters long." }),
        email: z
            .string()
            .trim()
            .min(1, { message: "Email cannot be empty." })
            .email({ message: "Invalid email address. Please check the format." }),
        phone: z
            .string()
            .trim()
            .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits." }),
        password: z
            .string()
            .trim()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,15}$/, {
                message:
                    "Password must be 4-15 characters and contain an uppercase letter, lowercase letter, number, and special character.",
            }),
        confirmPassword: z.string().trim().min(1, { message: "Confirm password cannot be empty." }),
        referralCode: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export const OtpSchema = z.object({
    otp: z.string().trim().min(6, "OTP must be 6 digits."),
});

export const emailSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: "Email cannot be empty." })
        .email({ message: "Invalid email address. Please check the format." }),
});
