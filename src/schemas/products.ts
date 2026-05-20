import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().positive(),
    paid_price: z.coerce.number().positive(),
    supplierId: z.coerce.number().int().gt(0),
    quantity: z.coerce.number().int(),
})