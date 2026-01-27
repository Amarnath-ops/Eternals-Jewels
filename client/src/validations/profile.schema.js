import z from "zod";
import { emailSchema, fullnameSchema, imageSchema, phoneSchema } from "./common.schema";

export const profileDetailsSchema = z.object({
    fullname: fullnameSchema,
    email: emailSchema,
    phone:phoneSchema,
    avatar: imageSchema
});
