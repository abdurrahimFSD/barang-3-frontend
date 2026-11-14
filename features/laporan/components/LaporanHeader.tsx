"use client"

import * as React from "react"
import { Loader2, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LaporanHeaderProps {
    title: string
    description: string
    onExportPdf: () => void
    isExporting: boolean
}

export function LaporanHeader({
    title,
    description,
    onExportPdf,
    isExporting,
}: LaporanHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {title}
                </h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button
                onClick={onExportPdf}
                disabled={isExporting}
                className="shrink-0 gap-2"
                title="Buka dokumen PDF pada tab baru untuk cetak atau unduh"
            >
                {isExporting ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <Printer className="size-4" />
                )}
                <span>Cetak PDF</span>
            </Button>
        </div>
    )
}
