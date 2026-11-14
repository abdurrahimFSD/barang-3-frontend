"use client"

import * as React from "react"
import { useQueryState, parseAsInteger } from "nuqs"

import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/shared/DataTablePagination"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { UnitTable } from "./UnitTable"
import { UnitModalForm } from "./UnitModalForm"
import { useUnits, useDeleteUnit } from "../hooks/useUnits"
import { useModalStore } from "@/stores/useModalStore"
import type { Unit } from "@/types/master"

export function SatuanView() {
    // Pagination URL state via nuqs
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

    // Data fetching
    const { data: response, isLoading } = useUnits({
        page,
        perPage: 10,
    })

    const units = response?.data || []
    const meta = response?.meta

    // Delete confirmation state via useModalStore
    const {
        isOpen,
        modalType,
        data: modalData,
        closeModal,
        openModal,
    } = useModalStore()
    const isDeleteModalOpen = isOpen && modalType === "confirmDeleteUnit"
    const unitToDelete = modalData as Unit | null
    const deleteMutation = useDeleteUnit()

    const handleConfirmDelete = () => {
        if (!unitToDelete) return
        deleteMutation.mutate(unitToDelete.id, {
            onSuccess: () => closeModal(),
        })
    }

    return (
        <div className="space-y-4">
            {/* Action Bar & Heading */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Master Satuan
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Kelola data satuan pengukuran untuk penentuan kuantitas
                        barang inventaris.
                    </p>
                </div>
                <Button
                    onClick={() => openModal("unitForm")}
                    className="h-9 gap-1.5 font-medium"
                >
                    <span>Tambah Satuan</span>
                </Button>
            </div>

            {/* Data Table */}
            <UnitTable
                data={units}
                isLoading={isLoading}
                page={page}
                perPage={10}
            />

            {/* Pagination */}
            <DataTablePagination
                meta={meta}
                onPageChange={(newPage) => setPage(newPage)}
                isLoading={isLoading}
            />

            {/* Create / Edit Form Modal */}
            <UnitModalForm />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={isDeleteModalOpen}
                onOpenChange={(open) => !open && closeModal()}
                title="Hapus Satuan?"
                description={`Apakah Anda yakin ingin menghapus satuan "${unitToDelete?.name || ""}"? Data yang sudah dihapus tidak dapat dipulihkan.`}
                confirmLabel="Hapus Data"
                cancelLabel="Batal"
                variant="destructive"
                isLoading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
