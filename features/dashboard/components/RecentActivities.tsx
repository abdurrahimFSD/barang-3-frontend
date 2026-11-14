"use client"

import * as React from "react"
import {
    ArrowDownLeft,
    ArrowUpRight,
    ArrowLeftRight,
    ClipboardList,
    Clock,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatRelativeTime } from "@/lib/formatters"
import type { RecentActivity } from "@/types/dashboard"

interface RecentActivitiesProps {
    activities?: RecentActivity[]
    isLoading: boolean
}

export function RecentActivities({
    activities = [],
    isLoading,
}: RecentActivitiesProps) {
    if (isLoading) {
        return (
            <Card className="border-border shadow-xs">
                <CardHeader>
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="mt-1 h-4 w-56" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <Skeleton className="size-8 shrink-0 rounded-lg" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-2.5 w-1/3" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">
                    Aktivitas Terbaru
                </CardTitle>
                <CardDescription>
                    Log pergerakan mutasi dan pengajuan terakhir
                </CardDescription>
            </CardHeader>
            <CardContent>
                {activities.length === 0 ? (
                    <div className="flex h-[280px] items-center justify-center text-xs text-muted-foreground">
                        Belum ada riwayat aktivitas terbaru.
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {activities.map((act) => {
                            const isMasuk = act.type === "masuk"
                            const isKeluar = act.type === "keluar"
                            const isRequest = act.type === "request"

                            const title =
                                act.title ||
                                (act.item
                                    ? `${isMasuk ? "Masuk" : isKeluar ? "Keluar" : "Mutasi"}: ${act.quantity ?? ""} ${act.item.unit ?? ""} ${act.item.name}`.trim()
                                    : act.transaction_code ||
                                      "Transaksi Mutasi")

                            const userName =
                                act.user?.name || act.user_name || "Sistem"

                            return (
                                <div
                                    key={act.id}
                                    className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                                >
                                    <div
                                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                                            isMasuk
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : isKeluar
                                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                                  : isRequest
                                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                    : "bg-primary/10 text-primary"
                                        }`}
                                    >
                                        {isMasuk ? (
                                            <ArrowDownLeft className="size-4" />
                                        ) : isKeluar ? (
                                            <ArrowUpRight className="size-4" />
                                        ) : isRequest ? (
                                            <ClipboardList className="size-4" />
                                        ) : (
                                            <ArrowLeftRight className="size-4" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-0.5">
                                        <p className="truncate text-xs font-medium text-foreground">
                                            {title}
                                        </p>
                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                            <span>{userName}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1 font-mono text-[10px]">
                                                <Clock className="size-3" />
                                                {formatRelativeTime(
                                                    act.created_at
                                                )}
                                            </span>
                                            {act.transaction_code && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono text-[10px] text-muted-foreground/80">
                                                        {act.transaction_code}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
