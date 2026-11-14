import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { PenggunaView } from "@/features/master/components/PenggunaView"

export const metadata: Metadata = {
    title: "Master Pengguna",
    description:
        "Pengelolaan akun pengguna dan role hak akses sistem inventaris",
}

export default async function PenggunaPage() {
    const cookieStore = await cookies()
    const role = cookieStore.get("user_role")?.value

    if (role === "staff") {
        redirect("/dashboard")
    }

    return <PenggunaView />
}
