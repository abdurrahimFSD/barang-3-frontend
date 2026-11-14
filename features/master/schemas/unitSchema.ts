import { z } from "zod"

export const unitSchema = z.object({
    name: z
        .string()
        .min(1, "Nama satuan wajib diisi")
        .max(50, "Maksimal 50 karakter"),
    abbreviation: z
        .string()
        .max(20, "Maksimal 20 karakter")
        .optional()
        .or(z.literal("")),
})

export type UnitFormValues = z.infer<typeof unitSchema>
