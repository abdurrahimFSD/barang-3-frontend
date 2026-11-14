import type { Metadata } from "next"
import { TransaksiCreateView } from "@/features/transaksi/components/TransaksiCreateView"

export const metadata: Metadata = {
    title: "Tambah Transaksi Mutasi",
    description: "Formulir pencatatan transaksi barang masuk dan barang keluar",
}

export default function TransaksiTambahPage() {
    return <TransaksiCreateView />
}
