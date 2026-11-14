"use client"

import * as React from "react"
import Link from "next/link"
import { useQueryState, parseAsInteger } from "nuqs"
import { Check, Eye, MoreVertical, X } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { DataTablePagination } from "@/components/shared/DataTablePagination"
import { PermintaanStatusBadge } from "./PermintaanStatusBadge"
import { formatDate } from "@/lib/formatters"
import { useItemRequests } from "../hooks/useItemRequests"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useModalStore } from "@/stores/useModalStore"

export function PermintaanTable() {
    const { isAdmin } = useCurrentUser()
    const { openModal } = useModalStore()

    const [searchQuery] = useQueryState("search", { defaultValue: "" })
    const [statusFilter] = useQueryState("status", { defaultValue: "" })
    const [userId] = useQueryState("user_id", { defaultValue: "" })
    const [startDate] = useQueryState("start_date", { defaultValue: "" })
    const [endDate] = useQueryState("end_date", { defaultValue: "" })
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
    const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(10))

    const {
        data: response,
        isLoading,
        isPlaceholderData,
    } = useItemRequests({
        search: searchQuery,
        status: statusFilter,
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
        page,
        per_page: perPage,
    })

    const requests = response?.data || []
    const meta = response?.meta
    const columnsCount = isAdmin ? 9 : 8

    return (
        <div className="w-full min-w-0 space-y-4">
            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                <Table className="min-w-[850px]">
                    <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className="w-12 text-center font-mono">No</TableHead>
                            <TableHead>Kode Permintaan</TableHead>
                            {isAdmin && <TableHead>Pemohon</TableHead>}
                            <TableHead>Tanggal Permintaan</TableHead>
                            <TableHead>Barang</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                            <TableHead>Keperluan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && !isPlaceholderData ? (
                            <TableSkeleton
                                columnsCount={columnsCount}
                                rowsCount={perPage}
                            />
                        ) : requests.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columnsCount}
                                    className="h-48 p-0"
                                >
                                    <EmptyState
                                        title="Belum ada permintaan barang"
                                        description={
                                            searchQuery || statusFilter
                                                ? "Tidak ada data pengajuan yang sesuai dengan filter yang diterapkan."
                                                : "Belum ada pengajuan permintaan barang inventaris yang tercatat."
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req, index) => {
                                const rowNumber =
                                    ((meta?.current_page || 1) - 1) * perPage +
                                    index +
                                    1
                                const unitAbbr =
                                    req.item?.unit?.abbreviation ||
                                    req.item?.unit?.name ||
                                    ""
                                const isPending = req.status === "pending"

                                return (
                                    <TableRow
                                        key={req.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <TableCell className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                            {rowNumber}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                                            {req.request_code}
                                        </TableCell>
                                        {isAdmin && (
                                            <TableCell className="text-xs font-medium text-foreground">
                                                {req.user?.name || "-"}
                                            </TableCell>
                                        )}
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {formatDate(req.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-foreground">
                                                    {req.item?.name || "-"}
                                                </span>
                                                {req.item?.code && (
                                                    <span className="font-mono text-[11px] text-muted-foreground">
                                                        {req.item.code}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs font-semibold tabular-nums">
                                            {req.quantity} {unitAbbr}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                                            {req.purpose || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <PermintaanStatusBadge
                                                status={req.status}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            title="Menu Aksi"
                                                        >
                                                            <MoreVertical className="size-4" />
                                                            <span className="sr-only">
                                                                Menu aksi
                                                            </span>
                                                        </Button>
                                                    }
                                                />
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        render={
                                                            <Link
                                                                href={`/permintaan/${req.id}`}
                                                            />
                                                        }
                                                    >
                                                        <Eye className="size-4" />
                                                        <span>Detail</span>
                                                    </DropdownMenuItem>
                                                    {isAdmin && isPending && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openModal(
                                                                        "approveItemRequest",
                                                                        req
                                                                    )
                                                                }
                                                                className="text-emerald-600 focus:bg-emerald-500/10 focus:text-emerald-700 dark:text-emerald-400 dark:focus:text-emerald-300"
                                                            >
                                                                <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                                                                <span>Setujui</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openModal(
                                                                        "rejectItemRequest",
                                                                        req
                                                                    )
                                                                }
                                                                variant="destructive"
                                                            >
                                                                <X className="size-4" />
                                                                <span>Tolak</span>
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
