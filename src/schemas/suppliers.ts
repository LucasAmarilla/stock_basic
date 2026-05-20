import { z } from "zod";

export const supplierSchema = z.object({
    name: z.string().min(1),
    phoneNumber: z.coerce.number().positive().gt(8),

})