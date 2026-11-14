import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LaporanStokView } from "@/features/laporan/components/LaporanStokView"

export const metadata: Metadata = {
    title: "Laporan Stok Barang | Sistem Inventaris",
    description:
        "Laporan ketersediaan stok barang gudang terkini",
}

export default async function LaporanStokPage() {
    const cookieStore = await cookies()
    const role = cookieStore.get("user_role")?.value

    if (role === "staff") {
        redirect("/dashboard")
    }

    return <LaporanStokView />
}
