"use client"

import * as React from "react"
import { useQueryState, parseAsInteger } from "nuqs"

import { SearchInput } from "@/components/shared/SearchInput"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUsers } from "@/features/master/hooks/useUsers"
import { useCurrentUser } from "@/hooks/useCurrentUser"

const STATUS_OPTIONS = [
    { value: "all", label: "Semua Status" },
    { value: "pending", label: "Menunggu Persetujuan" },
    { value: "approved", label: "Disetujui" },
    { value: "rejected", label: "Ditolak" },
]

export function PermintaanFilter() {
    const { isAdmin } = useCurrentUser()

    const [statusFilter, setStatusFilter] = useQueryState("status", {
        defaultValue: "",
    })
    const [userId, setUserId] = useQueryState("user_id", {
        defaultValue: "",
    })
    const [startDate, setStartDate] = useQueryState("start_date", {
        defaultValue: "",
    })
    const [endDate, setEndDate] = useQueryState("end_date", {
        defaultValue: "",
    })
    const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

    const { data: usersResponse } = useUsers({ all: true, enabled: isAdmin })
    const userOptions = React.useMemo(() => {
        const list = [{ value: "all", label: "Semua Pemohon" }]
        if (usersResponse?.data) {
            usersResponse.data.forEach((u) => {
                list.push({ value: String(u.id), label: u.name })
            })
        }
        return list
    }, [usersResponse?.data])

    const [open, setOpen] = React.useState(false)
    const [draftStatus, setDraftStatus] = React.useState(statusFilter || "all")
    const [draftUserId, setDraftUserId] = React.useState(userId || "all")
    const [draftStartDate, setDraftStartDate] = React.useState(startDate || "")
    const [draftEndDate, setDraftEndDate] = React.useState(endDate || "")

    const activeFilterCount = React.useMemo(() => {
        let count = 0
        if (statusFilter && statusFilter !== "all") count++
        if (isAdmin && userId && userId !== "all") count++
        if (startDate) count++
        if (endDate) count++
        return count
    }, [statusFilter, userId, startDate, endDate, isAdmin])

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setDraftStatus(statusFilter || "all")
            setDraftUserId(userId || "all")
            setDraftStartDate(startDate || "")
            setDraftEndDate(endDate || "")
        }
        setOpen(isOpen)
    }

    const handleApply = () => {
        setStatusFilter(draftStatus === "all" || !draftStatus ? null : draftStatus)
        setUserId(draftUserId === "all" || !draftUserId ? null : draftUserId)
        setStartDate(draftStartDate || null)
        setEndDate(draftEndDate || null)
        setPage(1)
        setOpen(false)
    }

    const handleReset = () => {
        setDraftStatus("all")
        setDraftUserId("all")
        setDraftStartDate("")
        setDraftEndDate("")
        setStatusFilter(null)
        setUserId(null)
        setStartDate(null)
        setEndDate(null)
        setPage(1)
        setOpen(false)
    }

    return (
        <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
            <SearchInput
                placeholder="Cari kode, barang, atau keperluan..."
                containerClassName="min-w-[220px] flex-1"
            />

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger
                    render={
                        <Button variant="outline" className="h-9 shrink-0 gap-1.5">
                            Filter
                            {activeFilterCount > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="px-1.5 py-0 text-xs"
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    }
                />
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filter Permintaan Barang</DialogTitle>
                        <DialogDescription>
                            Filter data permintaan berdasarkan status, pemohon, dan rentang tanggal.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="filter-status">Status Permintaan</Label>
                            <Select
                                items={STATUS_OPTIONS}
                                value={draftStatus}
                                onValueChange={(val) => setDraftStatus(val || "all")}
                            >
                                <SelectTrigger id="filter-status" className="h-9 w-full">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {isAdmin && (
                            <div className="space-y-2">
                                <Label htmlFor="filter-user">Pemohon</Label>
                                <Select
                                    items={userOptions}
                                    value={draftUserId}
                                    onValueChange={(val) => setDraftUserId(val || "all")}
                                >
                                    <SelectTrigger id="filter-user" className="h-9 w-full">
                                        <SelectValue placeholder="Semua Pemohon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="filter-start-date">Tanggal Mulai</Label>
                            <Input
                                id="filter-start-date"
                                type="date"
                                value={draftStartDate}
                                onChange={(e) => setDraftStartDate(e.target.value)}
                                className="h-9 font-mono text-xs"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filter-end-date">Tanggal Selesai</Label>
                            <Input
                                id="filter-end-date"
                                type="date"
                                value={draftEndDate}
                                onChange={(e) => setDraftEndDate(e.target.value)}
                                className="h-9 font-mono text-xs"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button onClick={handleApply}>
                            Terapkan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
