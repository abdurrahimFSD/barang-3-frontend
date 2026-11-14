"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Package } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { formatRupiah } from "@/lib/formatters"
import { BarangStockBadge } from "./BarangStockBadge"
import type { Item } from "@/types/barang"

interface BarangDetailCardProps {
    item?: Item | null
    isLoading: boolean
}

export function BarangDetailCard({ item, isLoading }: BarangDetailCardProps) {
    if (isLoading) {
        return (
            <Card className="border-border">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
                    <Skeleton className="size-9 rounded-md" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3.5 w-24" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!item) {
        return null
    }

    const unitLabel = item.unit?.abbreviation || item.unit?.name || ""

    return (
        <Card className="border-border shadow-xs">
            <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/barang"
                        className={cn(
                            buttonVariants({ variant: "outline", size: "icon" })
                        )}
                        title="Kembali ke Katalog Barang"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Package className="size-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg font-bold">
                                {item.name}
                            </CardTitle>
                            <BarangStockBadge
                                stock={item.stock}
                                minimumStock={item.minimum_stock}
                            />
                        </div>
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                            Kode: {item.code}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                        <span className="block text-[11px] font-medium text-muted-foreground">
                            Kategori
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold text-foreground">
                            {item.category?.name || "-"}
                        </span>
                    </div>

                    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                        <span className="block text-[11px] font-medium text-muted-foreground">
                            Satuan
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold text-foreground">
                            {item.unit?.name || "-"}{" "}
                            {unitLabel ? `(${unitLabel})` : ""}
                        </span>
                    </div>

                    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                        <span className="block text-[11px] font-medium text-muted-foreground">
                            Harga Satuan
                        </span>
                        <span className="mt-0.5 block font-mono text-sm font-semibold text-foreground tabular-nums">
                            {formatRupiah(item.price)}
                        </span>
                    </div>

                    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                        <span className="block text-[11px] font-medium text-muted-foreground">
                            Stok (Min: {item.minimum_stock})
                        </span>
                        <span className="mt-0.5 block font-mono text-base font-bold text-primary tabular-nums">
                            {item.stock} {unitLabel}
                        </span>
                    </div>
                </div>

                {item.description && (
                    <div className="mt-4 rounded-lg border border-border/50 bg-muted/30 p-3">
                        <span className="mb-1 block text-xs font-semibold text-foreground">
                            Deskripsi:
                        </span>
                        <p className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                            {item.description}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
