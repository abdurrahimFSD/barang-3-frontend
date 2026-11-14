import type { Metadata } from "next"
import { PermintaanDetailView } from "@/features/permintaan/components/PermintaanDetailView"

export const metadata: Metadata = {
    title: "Detail Permintaan Barang",
    description: "Detail permohonan barang inventaris dan riwayat peninjauan",
}

interface PermintaanDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function PermintaanDetailPage({
    params,
}: PermintaanDetailPageProps) {
    const { id } = await params

    return <PermintaanDetailView id={Number(id)} />
}
