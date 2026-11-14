"use client"

import * as React from "react"
import Link from "next/link"
import {
    AlertTriangle,
    ArrowLeftRight,
    ClipboardCheck,
    Package,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardKpi } from "@/types/dashboard"

interface KpiCardsProps {
    kpi?: DashboardKpi
    isLoading: boolean
}

export function KpiCards({ kpi, isLoading }: KpiCardsProps) {
    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="border-border shadow-xs">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="size-8 rounded-lg" />
                        </CardHeader>
                        <CardContent className="space-y-1.5">
                            <Skeleton className="h-7 w-16" />
                            <Skeleton className="h-3 w-36" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const items = [
        {
            title: "Katalog Barang",
            value: kpi?.total_items ?? 0,
            subtitle: "Total item terdaftar",
            href: "/barang",
            icon: Package,
            iconClass: "bg-primary/10 text-primary",
        },
        {
            title: "Transaksi Mutasi",
            value: kpi?.total_transactions ?? 0,
            subtitle: "Akumulasi mutasi fisik",
            href: "/transaksi",
            icon: ArrowLeftRight,
            iconClass:
                "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        },
        {
            title: "Permintaan Pending",
            value: kpi?.pending_requests ?? 0,
            subtitle: "Menunggu persetujuan",
            href: "/permintaan?status=pending",
            icon: ClipboardCheck,
            iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        },
        {
            title: "Peringatan Stok Rendah",
            value: kpi?.low_stock_items ?? 0,
            subtitle: "Di bawah batas minimum",
            href: "/barang",
            icon: AlertTriangle,
            iconClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        },
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => {
                const Icon = item.icon
                return (
                    <Link key={item.title} href={item.href} className="group">
                        <Card className="border-border shadow-xs transition-all hover:border-primary/50 hover:shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                                    {item.title}
                                </CardTitle>
                                <div
                                    className={`flex size-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${item.iconClass}`}
                                >
                                    <Icon className="size-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
                                    {item.value}
                                </div>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                    {item.subtitle}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}
