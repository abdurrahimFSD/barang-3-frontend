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
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/shared/TableSkeleton"
import { EmptyState } from "@/components/shared/EmptyState"
import { useModalStore } from "@/stores/useModalStore"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import type { User } from "@/types/auth"

interface UserTableProps {
    data?: User[]
    isLoading: boolean
    page?: number
    perPage?: number
}

export function UserTable({
    data = [],
    isLoading,
    page = 1,
    perPage = 10,
}: UserTableProps) {
    const { openModal } = useModalStore()
    const { user: currentUser } = useCurrentUser()

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-12 text-center font-mono">
                            No
                        </TableHead>
                        <TableHead>Nama Pengguna</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">Role</TableHead>
                        <TableHead className="w-24 text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableSkeleton columnsCount={5} rowsCount={5} />
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-48 p-0">
                                <EmptyState
                                    title="Belum ada data pengguna"
                                    description="Tambahkan akun pengguna baru untuk mengelola akses sistem."
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((user, index) => {
                            const rowNumber = (page - 1) * perPage + index + 1
                            const isSelf = currentUser?.id === user.id

                            return (
                                <TableRow
                                    key={user.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    <TableCell className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                        {rowNumber}
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={
                                                user.role === "admin"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="text-xs capitalize"
                                        >
                                            {user.role === "admin"
                                                ? "Admin"
                                                : "Staff"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    openModal("userForm", user)
                                                }
                                                className="hover:text-primary"
                                                title="Ubah Pengguna"
                                            >
                                                <Pencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    openModal(
                                                        "confirmDeleteUser",
                                                        user
                                                    )
                                                }
                                                disabled={isSelf}
                                                className="hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
                                                title={
                                                    isSelf
                                                        ? "Tidak dapat menghapus akun sendiri"
                                                        : "Hapus Pengguna"
                                                }
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
