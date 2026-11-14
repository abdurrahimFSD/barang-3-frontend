import { z } from "zod"

export const permintaanSchema = z.object({
    item_id: z.number().min(1, "Barang inventaris wajib dipilih"),
    quantity: z.number().min(1, "Jumlah minimal 1"),
    purpose: z
        .string()
        .min(5, "Keperluan permintaan minimal 5 karakter")
        .max(500, "Maksimal 500 karakter"),
})

export type PermintaanFormValues = z.infer<typeof permintaanSchema>
