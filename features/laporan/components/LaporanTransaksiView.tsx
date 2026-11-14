"use client"

import * as React from "react"
import { useQueryState } from "nuqs"
import { Calendar, X } from "lucide-react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { LaporanHeader } from "./LaporanHeader"
import { useTransactionReport } from "../hooks/useTransactionReport"
import { useExportReportPdf } from "../hooks/useExportReportPdf"
import { formatDateInput, formatDate } from "@/lib/formatters"
import { TransaksiTypeBadge } from "@/features/transaksi/components/TransaksiTypeBadge"

export function LaporanTransaksiView() {
    // Current month defaults
    const defaultDates = React.useMemo(() => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        return {
            start: formatDateInput(start),
            end: formatDateInput(now),
        }
    }, [])

    const [startDate, setStartDate] = useQueryState("start_date", {
        defaultValue: defaultDates.start,
    })
    const [endDate, setEndDate] = useQueryState("end_date", {
        defaultValue: defaultDates.end,
    })
    const [typeFilter, setTypeFilter] = useQueryState("type", {
        defaultValue: "",
    })

    const { data: response, isLoading } = useTransactionReport({
        start_date: startDate,
        end_date: endDate,
        type: typeFilter || null,
    })
    const exportPdfMutation = useExportReportPdf()

    const items = response?.data || []

    const handleExport = () => {
        exportPdfMutation.mutate({
            type: "transactions",
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            transaction_type: typeFilter || undefined,
        })
    }

    const handleReset = () => {
        setStartDate(defaultDates.start)
        setEndDate(defaultDates.end)
        setTypeFilter(null)
    }

    const isFiltered =
        startDate !== defaultDates.start ||
        endDate !== defaultDates.end ||
        Boolean(typeFilter)

    return (
        <div className="space-y-6">
            <LaporanHeader
                title="Laporan Riwayat Transaksi Mutasi"
                description="Rekapitulasi transaksi mutasi pergerakan barang masuk dan barang keluar pada periode terpilih."
                onExportPdf={handleExport}
                isExporting={exportPdfMutation.isPending}
            />

            {/* Filter Bar */}
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-1.5">
                    <div className="relative">
                        <Calendar className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value || null)
                            }
                            className="h-9 pl-8 font-mono text-xs"
                            title="Tanggal Mulai"
                        />
                    </div>
                    <span className="text-xs text-muted-foreground">-</span>
                    <div className="relative">
                        <Calendar className="pointer-events-none absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value || null)}
                            className="h-9 pl-8 font-mono text-xs"
                            title="Tanggal Selesai"
                        />
                    </div>
                </div>

                <div className="w-full sm:w-48">
                    <Select
                        value={typeFilter || "all"}
                        onValueChange={(val: string | null) =>
                            setTypeFilter(val === "all" || !val ? null : val)
                        }
                    >
                        <SelectTrigger className="h-9 w-full">
                            <SelectValue placeholder="Semua Tipe">
                                {!typeFilter || typeFilter === "all"
                                    ? "Semua Tipe Mutasi"
                                    : typeFilter === "masuk"
                                    ? "Barang Masuk"
                                    : "Barang Keluar"}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tipe Mutasi</SelectItem>
                            <SelectItem value="masuk">Barang Masuk</SelectItem>
                            <SelectItem value="keluar">Barang Keluar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {isFiltered && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-9 shrink-0 gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-3.5" />
                        <span>Reset Filter</span>
                    </Button>
                )}
            </div>

            {/* Data Table */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                <Table>
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
                        {isLoading ? (
                            <TableSkeleton columnsCount={8} rowsCount={10} />
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-48 p-0">
                                    <EmptyState
                                        title="Belum ada riwayat transaksi"
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item, index) => {
                                const isMasuk = item.type === "masuk"
                                const itemCode =
                                    item.item?.code || item.item_code || "-"
                                const itemName =
                                    item.item?.name || item.item_name || "-"
                                const unitName =
                                    item.unit?.abbreviation ||
                                    item.unit?.name ||
                                    item.unit_name ||
                                    ""
                                const userName =
                                    item.user?.name ||
                                    item.user_name ||
                                    "Sistem"

                                return (
                                    <TableRow
                                        key={item.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <TableCell className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                                            {item.transaction_code}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {formatDate(item.date)}
                                        </TableCell>
                                        <TableCell>
                                            <TransaksiTypeBadge type={item.type} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-foreground">
                                                    {itemName}
                                                </span>
                                                <span className="font-mono text-[11px] text-muted-foreground">
                                                    {itemCode}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs font-semibold tabular-nums">
                                            {isMasuk
                                                ? `+${item.quantity}`
                                                : `-${item.quantity}`}{" "}
                                            {unitName}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-foreground">
                                            {userName}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                                            {item.notes || "-"}
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
