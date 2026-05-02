import { z } from "zod";
import { confirmPasswordSchema as confirmPassword, emailSchema as email, fullnameSchema, passwordSchema, phoneSchema } from "./common.schema";

export const signupSchema = z
    .object({
        fullname: fullnameSchema,
        email,
        phone:phoneSchema,
        password: passwordSchema,
        confirmPassword: confirmPassword,
        referralCode: z.string().max(15, { message: "Referal code is too long." }).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export const OtpSchema = z.object({
    otp: z.string().trim().min(6, "OTP must be 6 digits.").max(7, { message: "OTP must be 6 digits." }),
});

export const emailSchema = z.object({
    email
});
export const loginSchema = z.object({
    email: email,
    password: passwordSchema
});

export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: confirmPassword
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export const changePasswordSchema = z
    .object({
        currentPassword: passwordSchema,
        newPassword: passwordSchema,
        confirmNewPassword: confirmPassword,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match.",
        path: ["confirmNewPassword"],
    });
