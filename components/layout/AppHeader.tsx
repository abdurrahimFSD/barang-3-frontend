"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/UserNav"
import { NotificationBell } from "@/features/notifications/components/NotificationBell"

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard Ringkasan",
    "/barang": "Katalog Barang",
    "/kategori": "Master Kategori",
    "/satuan": "Master Satuan",
    "/pengguna": "Master Pengguna",
    "/transaksi": "Transaksi Mutasi Barang",
    "/transaksi/tambah": "Tambah Transaksi Mutasi",
    "/permintaan": "Daftar Permintaan Barang",
    "/permintaan/tambah": "Pengajuan Permintaan Barang",
    "/laporan-stok": "Laporan Stok Barang",
    "/laporan-transaksi": "Laporan Riwayat Transaksi",
    "/laporan-permintaan": "Laporan Rekap Permintaan",
}

export function AppHeader() {
    const pathname = usePathname()
    const { resolvedTheme, setTheme } = useTheme()

    // Title resolution with fallback
    let currentTitle = pageTitles[pathname]
    if (!currentTitle) {
        if (pathname.startsWith("/barang/")) {
            currentTitle = "Detail Barang"
        } else if (pathname.startsWith("/permintaan/")) {
            currentTitle = "Detail Permintaan"
        } else {
            currentTitle = "Dashboard"
        }
    }

    return (
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm transition-[width,height] ease-linear">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-sm font-semibold tracking-tight text-foreground md:text-base">
                    {currentTitle}
                </h1>
            </div>

            <div className="flex items-center gap-2">
                <NotificationBell />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                    aria-label="Toggle tema gelap/terang"
                    className="size-8"
                    title="Toggle Theme (atau tekan 'd')"
                >
                    <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                </Button>

                <UserNav />
            </div>
        </header>
    )
}
