import type { Metadata } from "next"
import { BarangCreateView } from "@/features/barang/components/BarangCreateView"

export const metadata: Metadata = {
    title: "Tambah Barang Baru",
    description: "Pendaftaran item barang inventaris baru",
}

export default function BarangTambahPage() {
    return <BarangCreateView />
}
