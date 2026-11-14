import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SatuanView } from "@/features/master/components/SatuanView"

export const metadata: Metadata = {
    title: "Master Satuan",
    description: "Pengelolaan master satuan pengukuran barang inventaris",
}

export default async function SatuanPage() {
    const cookieStore = await cookies()
    const role = cookieStore.get("user_role")?.value

    if (role === "staff") {
        redirect("/dashboard")
    }

    return <SatuanView />
}
