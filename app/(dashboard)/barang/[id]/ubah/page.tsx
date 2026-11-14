import type { Metadata } from "next"
import { BarangEditView } from "@/features/barang/components/BarangEditView"

export const metadata: Metadata = {
    title: "Ubah Data Barang",
    description: "Perbarui informasi spesifikasi barang inventaris",
}

interface BarangUbahPageProps {
    params: Promise<{ id: string }>
}

export default async function BarangUbahPage({ params }: BarangUbahPageProps) {
    const { id } = await params

    return <BarangEditView id={id} />
}
