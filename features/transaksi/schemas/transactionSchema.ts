import { z } from "zod"

export const transactionSchema = z.object({
    type: z.enum(["masuk", "keluar"]),
    item_id: z.number().min(1, "Barang inventaris wajib dipilih"),
    quantity: z.number().min(1, "Jumlah minimal 1"),
    date: z.string().min(1, "Tanggal transaksi wajib diisi"),
    notes: z.string().optional().or(z.literal("")),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
