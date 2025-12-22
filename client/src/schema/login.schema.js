import z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .lowercase({message:"Email must be lowercase."})
        .trim()
        .min(1, { message: "Email cannot be empty." })
        .email({ message: "Invalid email address. Please check the format." }),
    password: z
        .string()
        .trim()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,15}$/, {
            message:
                "Password must be 4-15 characters and contain an uppercase letter, lowercase letter, number, and special character.",
        }),
});
