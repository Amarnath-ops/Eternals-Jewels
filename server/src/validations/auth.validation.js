import { z } from "zod";
import { isValidNumber } from "libphonenumber-js";
export const signupSchema = z
    .object({
        fullname: z
            .string()
            .trim()
            .min(3, { message: "Must be between 4 and 15 characters long." })
            .max(15, { message: "Must be between 4 and 15 characters long." }),
        email: z
            .email({ message: "Invalid email address. Please check the format." })
            .trim({ message: "Invalid email address. Please check the format." })
            .min(1, { message: "Email cannot be empty." })
            .lowercase({ message: "Invalid email address. Please check the format." })
            .max(50, { message: "Email address is too long." }),
        phone: z
            .string()
            .trim()
            .refine((value) => isValidNumber(value, "IN"), { message: "Phone number must be exactly 10 digits." }),
        password: z
            .string()
            .trim()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,15}$/, {
                message:
                    "Password must be 4-15 characters and contain an uppercase letter, lowercase letter, number, and special character.",
            }),
        confirmPassword: z.string().trim().min(1, { message: "Confirm password cannot be empty." }),
        referralCode: z.string().max(15, { message: "Referal code is too long." }).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export const OtpSchema = z.object({
    otp: z.string().trim().min(6, "OTP must be 6 digits.").max(6, { message: "OTP must be 6 digits." }),
});

export const emailSchema = z.object({
    email: z
        .email({ message: "Invalid email address. Please check the format." })
        .trim({ message: "Invalid email address. Please check the format." })
        .min(1, { message: "Email cannot be empty." })
        .lowercase({ message: "Invalid email address. Please check the format." })
        .max(50, { message: "Email address is too long." }),
});

export const loginSchema = z.object({
    email: z
        .email({ message: "Invalid email address. Please check the format." })
        .trim({ message: "Invalid email address. Please check the format." })
        .min(1, { message: "Email cannot be empty." })
        .lowercase({ message: "Invalid email address. Please check the format." })
        .max(50, { message: "Email address is too long." }),
    password: z
        .string()
        .trim()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,15}$/, {
            message:
                "Password must be 4-15 characters and contain an uppercase letter, lowercase letter, number, and special character.",
        }),
});

export const otpEmailSchema = z.object({
    email: z
        .email({ message: "Invalid email address. Please check the format." })
        .trim({ message: "Invalid email address. Please check the format." })
        .min(1, { message: "Email cannot be empty." })
        .lowercase({ message: "Invalid email address. Please check the format." })
        .max(50, { message: "Email address is too long." }),
    otp: z.string().trim().min(6, "OTP must be 6 digits.").max(6, { message: "OTP must be 6 digits." }),
});

export const resetPasswordSchema = z
    .object({
        email: z
            .email({ message: "Invalid email address. Please check the format." })
            .trim({ message: "Invalid email address. Please check the format." })
            .min(1, { message: "Email cannot be empty." })
            .lowercase({ message: "Invalid email address. Please check the format." })
            .max(50, { message: "Email address is too long." }),
        password: z
            .string()
            .trim()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,15}$/, {
                message:
                    "Password must be 4-15 characters and contain an uppercase letter, lowercase letter, number, and special character.",
            }),
        confirmPassword: z.string().trim().min(1, { message: "Confirm password cannot be empty." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });
