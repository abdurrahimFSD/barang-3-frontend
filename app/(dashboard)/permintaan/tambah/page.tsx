import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { PermintaanCreateView } from "@/features/permintaan/components/PermintaanCreateView"

export const metadata: Metadata = {
    title: "Tambah Permintaan Barang",
    description: "Formulir pengajuan permintaan barang inventaris",
}

export default async function PermintaanTambahPage() {
    const cookieStore = await cookies()
    const role = cookieStore.get("user_role")?.value

    if (role === "admin") {
        redirect("/permintaan")
    }

    return <PermintaanCreateView />
}
