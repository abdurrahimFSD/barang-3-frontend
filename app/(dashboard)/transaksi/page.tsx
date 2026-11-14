import type { Metadata } from "next"
import { TransaksiListView } from "@/features/transaksi/components/TransaksiListView"

export const metadata: Metadata = {
    title: "Transaksi Mutasi",
    description:
        "Catatan riwayat pergerakan barang masuk dan barang keluar inventaris",
}

export default function TransaksiPage() {
    return <TransaksiListView />
}
