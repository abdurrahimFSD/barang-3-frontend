"use client"

import * as React from "react"
import { useQueryState, parseAsInteger } from "nuqs"

import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/shared/DataTablePagination"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { UserTable } from "./UserTable"
import { UserModalForm } from "./UserModalForm"
import { useUsers, useDeleteUser } from "../hooks/useUsers"
import { useModalStore } from "@/stores/useModalStore"
import type { User } from "@/types/auth"

export function PenggunaView() {
    // Pagination URL state via nuqs
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

    // Data fetching
    const {
        data: response,
        isLoading,
        isPlaceholderData,
    } = useUsers({
        page,
        perPage: 10,
    })

    const users = response?.data || []
    const meta = response?.meta

    // Delete confirmation state via useModalStore
    const {
        isOpen,
        modalType,
        data: modalData,
        closeModal,
        openModal,
    } = useModalStore()
    const isDeleteModalOpen = isOpen && modalType === "confirmDeleteUser"
    const userToDelete = modalData as User | null
    const deleteMutation = useDeleteUser()

    const handleConfirmDelete = () => {
        if (!userToDelete) return
        deleteMutation.mutate(userToDelete.id, {
            onSuccess: () => closeModal(),
        })
    }

    return (
        <div className="space-y-4">
            {/* Action Bar & Heading */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Master Pengguna
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Kelola akun pengguna dan penetapan role hak akses sistem
                        (Admin & Staff).
                    </p>
                </div>
                <Button
                    onClick={() => openModal("userForm")}
                    className="h-9 gap-1.5 font-medium"
                >
                    <span>Tambah Pengguna</span>
                </Button>
            </div>

            {/* Data Table */}
            <UserTable
                data={users}
                isLoading={isLoading && !isPlaceholderData}
                page={page}
                perPage={10}
            />

            {/* Pagination */}
            <DataTablePagination
                meta={meta}
                onPageChange={(newPage) => setPage(newPage)}
                isLoading={isLoading || isPlaceholderData}
            />

            {/* Create / Edit Form Modal */}
            <UserModalForm />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={isDeleteModalOpen}
                onOpenChange={(open) => !open && closeModal()}
                title="Hapus Pengguna?"
                description={`Apakah Anda yakin ingin menghapus akun pengguna "${userToDelete?.name || ""}"? Data yang sudah dihapus tidak dapat dipulihkan.`}
                confirmLabel="Hapus Pengguna"
                cancelLabel="Batal"
                variant="destructive"
                isLoading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
