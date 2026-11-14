"use client"

import * as React from "react"
import { useQueryState } from "nuqs"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatRupiah } from "@/lib/formatters"
import { BarangStockBadge } from "@/features/barang/components/BarangStockBadge"
import { LaporanHeader } from "./LaporanHeader"
import { useStockReport } from "../hooks/useStockReport"
import { useExportReportPdf } from "../hooks/useExportReportPdf"
import { useCategories } from "@/features/master/hooks/useCategories"

export function LaporanStokView() {
    const [categoryId, setCategoryId] = useQueryState("category_id", {
        defaultValue: "",
    })

    const { data: response, isLoading } = useStockReport({
        category_id: categoryId || null,
    })
    const { data: categoryData } = useCategories({ all: true })
    const exportPdfMutation = useExportReportPdf()

    const items = response?.data || []
    const categories = categoryData?.data || []

    const handleExport = () => {
        exportPdfMutation.mutate({
            type: "stock",
            category_id: categoryId || undefined,
        })
    }

    return (
        <div className="space-y-6">
            <LaporanHeader
                title="Laporan Stok Barang"
                description="Rekapitulasi stok fisik aktif, ambang minimum, dan status ketersediaan barang inventaris."
                onExportPdf={handleExport}
                isExporting={exportPdfMutation.isPending}
            />

            {/* Filter Bar */}
            <div className="w-full sm:w-64">
                <Select
                    value={categoryId || "all"}
                    onValueChange={(val: string | null) =>
                        setCategoryId(val === "all" || !val ? null : val)
                    }
                >
                    <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Semua Kategori">
                            {!categoryId
                                ? "Semua Kategori"
                                : (categories.find((c) => String(c.id) === categoryId)?.name ?? "Semua Kategori")}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="w-12 text-center font-mono">No</TableHead>
                            <TableHead>Kode</TableHead>
                            <TableHead>Nama Barang</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Satuan</TableHead>
                            <TableHead className="text-right">Harga Satuan</TableHead>
                            <TableHead className="text-right">Sisa Stok</TableHead>
                            <TableHead className="text-right">Min Stok</TableHead>
                            <TableHead>Status Stok</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableSkeleton columnsCount={9} rowsCount={10} />
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-48 p-0">
                                    <EmptyState
                                        title="Belum ada data posisi stok"
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item, index) => {
                                const categoryName =
                                    item.category?.name ||
                                    item.category_name ||
                                    "-"
                                const unitName =
                                    item.unit?.abbreviation ||
                                    item.unit?.name ||
                                    item.unit_name ||
                                    "-"

                                return (
                                    <TableRow
                                        key={item.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <TableCell className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                                            {item.code}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-foreground">
                                            {item.name}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {categoryName}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {unitName}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs tabular-nums">
                                            {formatRupiah(item.price)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs font-semibold text-foreground tabular-nums">
                                            {item.stock}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                                            {item.minimum_stock}
                                        </TableCell>
                                        <TableCell>
                                            <BarangStockBadge
                                                stock={item.stock}
                                                minimumStock={item.minimum_stock}
                                                compact
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
