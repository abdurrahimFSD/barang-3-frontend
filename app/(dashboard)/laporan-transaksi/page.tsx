import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LaporanTransaksiView } from "@/features/laporan/components/LaporanTransaksiView"

export const metadata: Metadata = {
    title: "Laporan Riwayat Transaksi | Sistem Inventaris",
    description:
        "Laporan rekapitulasi transaksi mutasi pergerakan barang gudang",
}

export default async function LaporanTransaksiPage() {
    const cookieStore = await cookies()
    const role = cookieStore.get("user_role")?.value

    if (role === "staff") {
        redirect("/dashboard")
    }

    return <LaporanTransaksiView />
}
