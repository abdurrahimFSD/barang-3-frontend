import type { Metadata } from "next"
import { PermintaanListView } from "@/features/permintaan/components/PermintaanListView"

export const metadata: Metadata = {
    title: "Permintaan Barang",
    description: "Pengajuan dan riwayat status permintaan barang inventaris",
}

export default function PermintaanPage() {
    return <PermintaanListView />
}
