"use client"

import * as React from "react"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import type { DashboardPeriod } from "@/types/dashboard"
import { useDashboardMetrics } from "../hooks/useDashboardMetrics"
import { KpiCards } from "./KpiCards"
import { MovementChart } from "./MovementChart"
import { RecentActivities } from "./RecentActivities"

export function DashboardView() {
    const { user } = useCurrentUser()
    const [period, setPeriod] = React.useState<DashboardPeriod>("6m")
    const { data: response, isLoading } = useDashboardMetrics(period)

    const metrics = response?.data
    const kpi = metrics?.summary ?? metrics?.kpi
    const movement = metrics?.stock_movement ?? metrics?.monthly_movement

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Selamat Datang{user?.name ? `, ${user.name}` : ""}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ringkasan metrik operasional inventaris dan tren pergerakan
                    stok barang.
                </p>
            </div>

            {/* 4 KPI Summary Cards */}
            <KpiCards kpi={kpi} isLoading={isLoading} />

            {/* Asymmetric Visual Grid: Chart & Recent Activities */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <MovementChart
                        data={movement}
                        period={period}
                        onPeriodChange={setPeriod}
                        isLoading={isLoading}
                    />
                </div>
                <div className="lg:col-span-3">
                    <RecentActivities
                        activities={metrics?.recent_activities}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    )
}
