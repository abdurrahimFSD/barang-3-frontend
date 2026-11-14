import type { Metadata } from "next"
import { DashboardView } from "@/features/dashboard/components/DashboardView"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Ringkasan metrik inventaris barang dan mutasi stok",
}

export default function DashboardPage() {
    return <DashboardView />
}
