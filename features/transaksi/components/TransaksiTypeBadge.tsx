import * as React from "react"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { TransactionType } from "@/types/transaction"

interface TransaksiTypeBadgeProps {
    type: TransactionType | string
    className?: string
}

export function TransaksiTypeBadge({
    type,
    className,
}: TransaksiTypeBadgeProps) {
    const isMasuk = type === "masuk"

    if (isMasuk) {
        return (
            <Badge
                className={cn(
                    "gap-1 border-emerald-500/30 bg-emerald-500/15 text-[11px] font-medium text-emerald-700 dark:text-emerald-400",
                    className
                )}
            >
                <ArrowDownLeft className="size-3" />
                <span>Barang Masuk</span>
            </Badge>
        )
    }

    return (
        <Badge
            className={cn(
                "gap-1 border-rose-500/30 bg-rose-500/15 text-[11px] font-medium text-rose-700 dark:text-rose-400",
                className
            )}
        >
            <ArrowUpRight className="size-3" />
            <span>Barang Keluar</span>
        </Badge>
    )
}

