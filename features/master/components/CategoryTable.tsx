"use client"

import * as React from "react"
import { Pencil, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { useModalStore } from "@/stores/useModalStore"
import type { Category } from "@/types/master"

interface CategoryTableProps {
    data?: Category[]
    isLoading: boolean
    page?: number
    perPage?: number
}

export function CategoryTable({
    data = [],
    isLoading,
    page = 1,
    perPage = 10,
}: CategoryTableProps) {
    const { openModal } = useModalStore()

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-12 text-center font-mono">
                            No
                        </TableHead>
                        <TableHead>Nama Kategori</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="w-24 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableSkeleton columnsCount={4} rowsCount={5} />
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-48 p-0">
                                <EmptyState
                                    title="Belum ada data kategori"
                                    description="Tambahkan kategori baru untuk mulai mengelompokkan inventaris."
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((category, index) => {
                            const rowNumber = (page - 1) * perPage + index + 1
                            return (
                                <TableRow
                                    key={category.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    <TableCell className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                        {rowNumber}
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {category.description || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() =>
                                                    openModal(
                                                        "categoryForm",
                                                        category
                                                    )
                                                }
                                                className="size-7 hover:text-primary"
                                                title="Ubah Kategori"
                                            >
                                                <Pencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                onClick={() =>
                                                    openModal(
                                                        "confirmDeleteCategory",
                                                        category
                                                    )
                                                }
                                                className="size-7 hover:bg-destructive/10 hover:text-destructive"
                                                title="Hapus Kategori"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
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
