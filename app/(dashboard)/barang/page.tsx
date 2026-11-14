import type { Metadata } from "next"
import { BarangListView } from "@/features/barang/components/BarangListView"

export const metadata: Metadata = {
    title: "Katalog Barang",
    description:
        "Katalog inventaris barang, saldo stok, dan batas minimum stok",
}

export default function BarangPage() {
    return <BarangListView />
}
