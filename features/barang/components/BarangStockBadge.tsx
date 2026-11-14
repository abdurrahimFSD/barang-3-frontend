import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StockStatus = "out_of_stock" | "low_stock" | "normal"

export interface BarangStockBadgeProps {
    stock: number
    minimumStock: number
    unitLabel?: string
    showValue?: boolean
    compact?: boolean
    className?: string
}

export function getStockStatus(stock: number, minimumStock: number): StockStatus {
    if (stock <= 0) return "out_of_stock"
    if (stock <= minimumStock) return "low_stock"
    return "normal"
}

export function BarangStockBadge({
    stock,
    minimumStock,
    unitLabel,
    showValue = false,
    compact = false,
    className,
}: BarangStockBadgeProps) {
    const status = getStockStatus(stock, minimumStock)
    const unitSuffix = unitLabel ? ` ${unitLabel}` : ""

    const config = {
        out_of_stock: {
            label: compact ? "Habis" : "Stok Habis",
            badgeVariant: "destructive" as const,
            badgeClass: "",
            valueClass: "text-destructive font-semibold",
        },
        low_stock: {
            label: compact ? "Rendah" : "Stok Rendah",
            badgeVariant: "default" as const,
            badgeClass: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",
            valueClass: "text-amber-600 dark:text-amber-400 font-semibold",
        },
        normal: {
            label: compact ? "Normal" : "Stok Normal",
            badgeVariant: "default" as const,
            badgeClass: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
            valueClass: "text-foreground font-medium",
        },
    }[status]

    const sizeClass = compact ? "px-1.5 py-0 text-[10px]" : "text-xs"

    const badge = (
        <Badge
            variant={config.badgeVariant}
            className={cn(sizeClass, config.badgeClass, !showValue && className)}
        >
            {config.label}
        </Badge>
    )

    if (!showValue) {
        return badge
    }

    return (
        <div className={cn("flex flex-col items-center gap-1", className)}>
            <span
                className={cn(
                    "font-mono text-xs tabular-nums",
                    config.valueClass
                )}
            >
                {stock}
                {unitSuffix}
            </span>
            {badge}
        </div>
    )
}

