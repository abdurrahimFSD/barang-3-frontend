"use client"

import * as React from "react"
import Link from "next/link"
import { Eye, Pencil, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatRupiah } from "@/lib/formatters"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { DataTableColumnHeader } from "@/components/shared/DataTableColumnHeader"
import { useModalStore } from "@/stores/useModalStore"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { BarangStockBadge } from "./BarangStockBadge"
import type { Item } from "@/types/barang"

interface BarangTableProps {
    data?: Item[]
    isLoading: boolean
    page?: number
    perPage?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
    onSort?: (column: string) => void
}

export function BarangTable({
    data = [],
    isLoading,
    page = 1,
    perPage = 10,
    sortBy,
    sortOrder,
    onSort,
}: BarangTableProps) {
    const { openModal } = useModalStore()
    const { isAdmin } = useCurrentUser()

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-12 text-center font-mono">No</TableHead>
                        <TableHead>
                            <DataTableColumnHeader
                                title="Kode"
                                sortKey="code"
                                activeSortBy={sortBy}
                                activeSortOrder={sortOrder}
                                onSort={onSort || (() => {})}
                            />
                        </TableHead>
                        <TableHead>
                            <DataTableColumnHeader
                                title="Nama Barang"
                                sortKey="name"
                                activeSortBy={sortBy}
                                activeSortOrder={sortOrder}
                                onSort={onSort || (() => {})}
                            />
                        </TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Satuan</TableHead>
                        <TableHead className="text-right">
                            <DataTableColumnHeader
                                title="Harga"
                                sortKey="price"
                                activeSortBy={sortBy}
                                activeSortOrder={sortOrder}
                                onSort={onSort || (() => {})}
                                align="right"
                            />
                        </TableHead>
                        <TableHead className="text-center">
                            <DataTableColumnHeader
                                title="Stok"
                                sortKey="stock"
                                activeSortBy={sortBy}
                                activeSortOrder={sortOrder}
                                onSort={onSort || (() => {})}
                                align="center"
                            />
                        </TableHead>
                        <TableHead className="w-28 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableSkeleton columnsCount={8} rowsCount={5} />
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-48 p-0">
                                <EmptyState title="Belum ada data barang" />
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => {
                            const rowNumber = (page - 1) * perPage + index + 1
                            const unitName =
                                item.unit?.abbreviation || item.unit?.name || ""

                            return (
                                <TableRow
                                    key={item.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    <TableCell className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                        {rowNumber}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs font-semibold text-primary">
                                        {item.code}
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        {item.name}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {item.category?.name || "-"}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {item.unit?.name || "-"}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs tabular-nums">
                                        {formatRupiah(item.price)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <BarangStockBadge
                                            stock={item.stock}
                                            minimumStock={item.minimum_stock}
                                            unitLabel={unitName}
                                            showValue
                                            compact
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/barang/${item.id}`}
                                                className={cn(
                                                    buttonVariants({
                                                        variant: "ghost",
                                                        size: "icon-sm",
                                                    }),
                                                    "hover:text-primary"
                                                )}
                                                title="Lihat Detail & Riwayat Transaksi"
                                            >
                                                <Eye className="size-3.5" />
                                            </Link>

                                            {isAdmin && (
                                                <>
                                                    <Link
                                                        href={`/barang/${item.id}/ubah`}
                                                        className={cn(
                                                            buttonVariants({
                                                                variant:
                                                                    "ghost",
                                                                size: "icon-sm",
                                                            }),
                                                            "hover:text-primary"
                                                        )}
                                                        title="Ubah Data Barang"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() =>
                                                            openModal(
                                                                "confirmDeleteBarang",
                                                                item
                                                            )
                                                        }
                                                        className="hover:bg-destructive/10 hover:text-destructive"
                                                        title="Hapus Barang"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
