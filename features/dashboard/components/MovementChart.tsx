"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardPeriod, MonthlyMovement } from "@/types/dashboard"

interface MovementChartProps {
    data?: MonthlyMovement[]
    period?: DashboardPeriod
    onPeriodChange?: (period: DashboardPeriod) => void
    isLoading: boolean
}

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
    { value: "7d", label: "7 Hari Terakhir" },
    { value: "30d", label: "30 Hari Terakhir" },
    { value: "6m", label: "6 Bulan Terakhir" },
    { value: "1y", label: "1 Tahun Terakhir" },
]

const chartConfig = {
    masuk: {
        label: "Barang Masuk",
        color: "var(--chart-2)",
    },
    keluar: {
        label: "Barang Keluar",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function MovementChart({
    data = [],
    period = "6m",
    onPeriodChange,
    isLoading,
}: MovementChartProps) {
    const chartData = React.useMemo(() => {
        return data.map((item) => ({
            ...item,
            displayLabel: item.label || item.month || item.date || "-",
        }))
    }, [data])

    if (isLoading) {
        return (
            <Card className="border-border shadow-xs">
                <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="mt-1 h-4 w-72" />
                    </div>
                    <Skeleton className="h-8 w-full sm:w-[150px]" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[280px] w-full rounded-xl" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border shadow-xs">
            <CardHeader className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="text-base font-semibold">
                        Tren Mutasi Barang
                    </CardTitle>
                    <CardDescription>
                        Perbandingan kuantitas pergerakan barang masuk vs barang
                        keluar
                    </CardDescription>
                </div>
                {onPeriodChange && (
                    <div className="w-full sm:w-auto">
                        <Select
                            items={PERIOD_OPTIONS}
                            value={period}
                            onValueChange={(val) => {
                                if (val) onPeriodChange(val as DashboardPeriod)
                            }}
                        >
                            <SelectTrigger className="h-8 w-full text-xs sm:w-[150px]">
                                <SelectValue>
                                    {PERIOD_OPTIONS.find((p) => p.value === period)
                                        ?.label ?? "6 Bulan Terakhir"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent align="end">
                                {PERIOD_OPTIONS.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                        className="text-xs"
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="flex h-[280px] items-center justify-center text-xs text-muted-foreground">
                        Belum ada data riwayat mutasi bulanan.
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="h-[280px] w-full"
                    >
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 12,
                                right: 12,
                                left: -16,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                className="stroke-muted/40"
                            />
                            <XAxis
                                dataKey="displayLabel"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                className="font-mono text-xs"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                className="font-mono text-xs tabular-nums"
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        indicator="dot"
                                        className="font-mono text-xs"
                                    />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar
                                dataKey="masuk"
                                fill="var(--color-masuk)"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="keluar"
                                fill="var(--color-keluar)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
