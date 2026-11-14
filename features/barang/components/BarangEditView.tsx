"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, AlertCircle, Pencil } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarangForm } from "./BarangForm"
import { useBarangDetail } from "../hooks/useBarangDetail"

interface BarangEditViewProps {
    id: string | number
}

export function BarangEditView({ id }: BarangEditViewProps) {
    const { data: item, isLoading, isError } = useBarangDetail(id)

    if (isLoading) {
        return (
            <div className="w-full space-y-6">
                <Card className="w-full border-border">
                    <CardHeader className="space-y-2 border-b border-border/60 pb-5">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-96 max-w-full" />
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 rounded-lg" />
                            ))}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 rounded-lg" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isError || !item) {
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

    return (
        <div className="w-full space-y-6">
            <Card className="w-full border-border shadow-xs">
                <CardHeader className="border-b border-border/60 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Pencil className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">
                                Ubah Data Barang: {item.name}
                            </CardTitle>
                            <CardDescription className="mt-0.5 text-xs">
                                Perbarui informasi spesifikasi katalog, harga
                                satuan, dan batas minimum stok inventaris.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <BarangForm initialData={item} isEdit={true} />
                </CardContent>
            </Card>
        </div>
    )
}
