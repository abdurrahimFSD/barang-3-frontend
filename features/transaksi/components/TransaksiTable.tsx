"use client"

import * as React from "react"
import { useQueryState, parseAsInteger } from "nuqs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { DataTablePagination } from "@/components/shared/DataTablePagination"
import { formatDate } from "@/lib/formatters"
import { useTransactions } from "../hooks/useTransactions"
import { TransaksiTypeBadge } from "./TransaksiTypeBadge"

export function TransaksiTable() {
    const [searchQuery] = useQueryState("search", { defaultValue: "" })
    const [typeFilter] = useQueryState("type", { defaultValue: "" })
    const [userId] = useQueryState("user_id", { defaultValue: "" })
    const [startDate] = useQueryState("start_date", { defaultValue: "" })
    const [endDate] = useQueryState("end_date", { defaultValue: "" })
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
    const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(10))

    const {
        data: response,
        isLoading,
        isPlaceholderData,
    } = useTransactions({
        search: searchQuery,
        type: typeFilter,
        user_id: userId || undefined,
        start_date: startDate,
        end_date: endDate,
        page,
        per_page: perPage,
    })

    const transactions = response?.data || []
    const meta = response?.meta

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="w-12 text-center font-mono">No</TableHead>
                            <TableHead>Kode Transaksi</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Tipe Mutasi</TableHead>
                            <TableHead>Barang</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead>Pencatat</TableHead>
                            <TableHead>Catatan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && !isPlaceholderData ? (
                            <TableSkeleton
                                columnsCount={8}
                                rowsCount={perPage}
                            />
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-48 p-0">
                                    <EmptyState
                                        title="Belum ada transaksi mutasi"
                                        description={
                                            searchQuery ||
                                            typeFilter ||
                                            userId ||
                                            startDate ||
                                            endDate
                                                ? "Tidak ada mutasi yang sesuai dengan kriteria filter yang diterapkan."
                                                : "Belum ada transaksi barang masuk atau barang keluar yang tercatat."
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((trx, index) => {
                                const isMasuk = trx.type === "masuk"
                                const rowNumber =
                                    ((meta?.current_page || 1) - 1) * perPage +
                                    index +
                                    1
                                const unitAbbr =
                                    trx.item?.unit?.abbreviation ||
                                    trx.item?.unit?.name ||
                                    ""

                                return (
                                    <TableRow
                                        key={trx.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <TableCell className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                            {rowNumber}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                                            {trx.transaction_code}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {formatDate(trx.date)}
                                        </TableCell>
                                        <TableCell>
                                            <TransaksiTypeBadge type={trx.type} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-foreground">
                                                    {trx.item?.name || "-"}
                                                </span>
                                                {trx.item?.code && (
                                                    <span className="font-mono text-[11px] text-muted-foreground">
                                                        {trx.item.code}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs font-semibold tabular-nums">
                                            {isMasuk
                                                ? `+${trx.quantity}`
                                                : `-${trx.quantity}`}{" "}
                                            {unitAbbr}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-foreground">
                                            {trx.user?.name || "-"}
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

            <DataTablePagination
                meta={meta}
                onPageChange={(p) => setPage(p)}
                isLoading={isLoading || isPlaceholderData}
            />
        </div>
    )
}
