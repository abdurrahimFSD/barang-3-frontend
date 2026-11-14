import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { KategoriView } from "@/features/master/components/KategoriView"

export const metadata: Metadata = {
    title: "Master Kategori",
    description: "Pengelolaan master kategori barang inventaris",
}

export default async function KategoriPage() {
    const cookieStore = await cookies()
    const role = cookieStore.get("user_role")?.value

    if (role === "staff") {
        redirect("/dashboard")
    }

    return <KategoriView />
}
