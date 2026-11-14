import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LaporanPermintaanView } from "@/features/laporan/components/LaporanPermintaanView"

export const metadata: Metadata = {
    title: "Laporan Permintaan Barang | Sistem Inventaris",
    description:
        "Laporan riwayat pengajuan dan persetujuan barang oleh staf dan admin",
}

export default async function LaporanPermintaanPage() {
    const cookieStore = await cookies()
    const role = cookieStore.get("user_role")?.value

    if (role === "staff") {
        redirect("/dashboard")
    }

    return <LaporanPermintaanView />
}
