import z from "zod";

export const profileDetailsSchema = z.object({
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
        .regex(/^[0-9]{10}$/, { message: "Phone number must be exactly 10 digits." }),
    avatar: z
        .any()
        .refine((file) => !file || file instanceof File, "Invalid file.")
        .refine((file) => !file || file.size <= 2 * 1024 * 1024, "Image must be less than 2MB")
});
