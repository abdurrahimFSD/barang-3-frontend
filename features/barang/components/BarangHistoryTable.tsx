"use client"

import * as React from "react"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { formatDate } from "@/lib/formatters"
import type { ItemTransactionHistory } from "@/types/barang"

interface BarangHistoryTableProps {
    transactions?: ItemTransactionHistory[]
    isLoading: boolean
    unitLabel?: string
}

export function BarangHistoryTable({
    transactions = [],
    isLoading,
    unitLabel = "",
}: BarangHistoryTableProps) {
    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                    Riwayat Mutasi Transaksi
                </h3>
                <p className="text-xs text-muted-foreground">
                    Catatan seluruh aktivitas pergerakan barang masuk dan keluar
                    untuk item ini.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="w-12 text-center font-mono">No</TableHead>
                            <TableHead>Kode Transaksi</TableHead>
                            <TableHead>Tipe Mutasi</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Dicatat Oleh</TableHead>
                            <TableHead>Catatan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableSkeleton columnsCount={7} rowsCount={4} />
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-44 p-0">
                                    <EmptyState
                                        title="Belum ada riwayat transaksi untuk barang ini"
                                        description="Mutasi barang masuk atau keluar belum pernah dicatat untuk item ini."
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((trx, index) => {
                                const isMasuk = trx.type === "masuk"

                                return (
                                    <TableRow
                                        key={trx.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <TableCell className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                                            {trx.transaction_code}
                                        </TableCell>
                                        <TableCell>
                                            {isMasuk ? (
                                                <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                                                    <ArrowDownLeft className="size-3" />
                                                    <span>Barang Masuk</span>
                                                </Badge>
                                            ) : (
                                                <Badge className="gap-1 border-rose-500/30 bg-rose-500/15 text-[11px] font-medium text-rose-700 dark:text-rose-400">
                                                    <ArrowUpRight className="size-3" />
                                                    <span>Barang Keluar</span>
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs font-semibold tabular-nums">
                                            {isMasuk
                                                ? `+${trx.quantity}`
                                                : `-${trx.quantity}`}{" "}
                                            {unitLabel}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {formatDate(trx.date)}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-foreground">
                                            {trx.user_name || "-"}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                                            {trx.notes || "-"}
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
