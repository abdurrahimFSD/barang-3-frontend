"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarangDetailCard } from "./BarangDetailCard"
import { BarangHistoryTable } from "./BarangHistoryTable"
import { useBarangDetail } from "../hooks/useBarangDetail"

interface BarangDetailViewProps {
    id: string | number
}

export function BarangDetailView({ id }: BarangDetailViewProps) {
    const { data: item, isLoading, isError } = useBarangDetail(id)

    if (isError || (!isLoading && !item)) {
        return (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center">
                <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="size-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                    Barang Tidak Ditemukan
                </h3>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                    Item barang dengan ID ini tidak tersedia atau telah dihapus
                    dari sistem.
                </p>
                <Link
                    href="/barang"
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "mt-4 gap-1.5"
                    )}
                >
                    <ArrowLeft className="size-4" />
                    <span>Kembali ke Katalog</span>
                </Link>
            </div>
        )
    }

    const unitLabel = item?.unit?.abbreviation || item?.unit?.name || ""

    return (
        <div className="space-y-6">
            <BarangDetailCard item={item} isLoading={isLoading} />
            <BarangHistoryTable
                transactions={item?.transactions_history || []}
                isLoading={isLoading}
                unitLabel={unitLabel}
            />
        </div>
    )
}
