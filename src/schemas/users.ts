import { z } from "zod";

export const supplierSchema = z.object({
    username: z.string().min(1),
    password: z.coerce.string().min(8, { message: "La contraseña debe tener mas de 8 caracteres" }),
    admin: z.boolean(),
})