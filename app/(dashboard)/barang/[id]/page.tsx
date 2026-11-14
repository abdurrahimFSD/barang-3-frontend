import type { Metadata } from "next"
import { BarangDetailView } from "@/features/barang/components/BarangDetailView"

export const metadata: Metadata = {
    title: "Detail Barang",
    description: "Detail spesifikasi barang dan riwayat mutasi transaksi",
}

interface BarangDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function BarangDetailPage({
    params,
}: BarangDetailPageProps) {
    const { id } = await params

    return <BarangDetailView id={id} />
}
