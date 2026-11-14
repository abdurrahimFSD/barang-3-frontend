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

const TYPE_OPTIONS = [
    { value: "all", label: "Semua Tipe" },
    { value: "masuk", label: "Barang Masuk" },
    { value: "keluar", label: "Barang Keluar" },
]

export function TransaksiFilter() {
    const [typeFilter, setTypeFilter] = useQueryState("type", {
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

    const { data: usersResponse } = useUsers({ all: true })
    const userOptions = React.useMemo(() => {
        const list = [{ value: "all", label: "Semua Pencatat" }]
        if (usersResponse?.data) {
            usersResponse.data.forEach((u) => {
                list.push({ value: String(u.id), label: u.name })
            })
        }
        return list
    }, [usersResponse?.data])

    const [open, setOpen] = React.useState(false)
    const [draftType, setDraftType] = React.useState(typeFilter || "all")
    const [draftUserId, setDraftUserId] = React.useState(userId || "all")
    const [draftStartDate, setDraftStartDate] = React.useState(startDate || "")
    const [draftEndDate, setDraftEndDate] = React.useState(endDate || "")

    const activeFilterCount = React.useMemo(() => {
        let count = 0
        if (typeFilter && typeFilter !== "all") count++
        if (userId && userId !== "all") count++
        if (startDate) count++
        if (endDate) count++
        return count
    }, [typeFilter, userId, startDate, endDate])

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setDraftType(typeFilter || "all")
            setDraftUserId(userId || "all")
            setDraftStartDate(startDate || "")
            setDraftEndDate(endDate || "")
        }
        setOpen(isOpen)
    }

    const handleApply = () => {
        setTypeFilter(draftType === "all" || !draftType ? null : draftType)
        setUserId(draftUserId === "all" || !draftUserId ? null : draftUserId)
        setStartDate(draftStartDate || null)
        setEndDate(draftEndDate || null)
        setPage(1)
        setOpen(false)
    }

    const handleReset = () => {
        setDraftType("all")
        setDraftUserId("all")
        setDraftStartDate("")
        setDraftEndDate("")
        setTypeFilter(null)
        setUserId(null)
        setStartDate(null)
        setEndDate(null)
        setPage(1)
        setOpen(false)
    }

    return (
        <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
            <SearchInput
                placeholder="Cari kode transaksi, barang, atau catatan..."
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
                        <DialogTitle>Filter Transaksi</DialogTitle>
                        <DialogDescription>
                            Filter data transaksi berdasarkan tipe, pencatat, dan rentang tanggal.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="filter-type">Tipe Transaksi</Label>
                            <Select
                                items={TYPE_OPTIONS}
                                value={draftType}
                                onValueChange={(val) => setDraftType(val || "all")}
                            >
                                <SelectTrigger id="filter-type" className="h-9 w-full">
                                    <SelectValue>
                                        {TYPE_OPTIONS.find((i) => i.value === draftType)?.label ?? "Semua Tipe"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPE_OPTIONS.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="filter-user">Nama Pencatat</Label>
                            <Select
                                items={userOptions}
                                value={draftUserId}
                                onValueChange={(val) => setDraftUserId(val || "all")}
                            >
                                <SelectTrigger id="filter-user" className="h-9 w-full">
                                    <SelectValue>
                                        {userOptions.find((i) => i.value === draftUserId)?.label ?? "Semua Pencatat"}
                                    </SelectValue>
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
