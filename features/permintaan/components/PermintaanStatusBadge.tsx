"use client"

import * as React from "react"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ItemRequestStatus } from "@/types/permintaan"

interface PermintaanStatusBadgeProps {
    status: ItemRequestStatus
}

export function PermintaanStatusBadge({ status }: PermintaanStatusBadgeProps) {
    switch (status) {
        case "approved":
            return (
                <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-3" />
                    <span>Disetujui</span>
                </Badge>
            )
        case "rejected":
            return (
                <Badge className="gap-1 border-rose-500/30 bg-rose-500/15 text-[11px] font-medium text-rose-700 dark:text-rose-400">
                    <XCircle className="size-3" />
                    <span>Ditolak</span>
                </Badge>
            )
        case "pending":
        default:
            return (
                <Badge className="gap-1 border-amber-500/30 bg-amber-500/15 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                    <Clock className="size-3" />
                    <span>Menunggu Persetujuan</span>
                </Badge>
            )
    }
}
