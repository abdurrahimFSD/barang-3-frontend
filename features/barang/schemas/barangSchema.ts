import { z } from "zod"

export const barangSchema = z.object({
    code: z
        .string()
        .max(50, "Maksimal 50 karakter")
        .optional()
        .or(z.literal("")),
    name: z
        .string()
        .min(1, "Nama barang wajib diisi")
        .max(255, "Maksimal 255 karakter"),
    category_id: z
        .number({ error: "Kategori wajib dipilih" })
        .min(1, "Kategori wajib dipilih"),
    unit_id: z
        .number({ error: "Satuan wajib dipilih" })
        .min(1, "Satuan wajib dipilih"),
    price: z
        .number({ error: "Harga wajib berupa angka" })
        .min(0, "Harga tidak boleh bernilai negatif"),
    stock: z
        .number({ error: "Stok wajib berupa angka" })
        .min(0, "Stok tidak boleh bernilai negatif"),
    minimum_stock: z
        .number({ error: "Minimum stok wajib berupa angka" })
        .min(0, "Minimum stok tidak boleh bernilai negatif"),
    description: z.string().optional().or(z.literal("")),
})

export type BarangFormValues = z.infer<typeof barangSchema>
