"use client"

import * as React from "react"
import { useQueryState, parseAsInteger } from "nuqs"

import { Button } from "@/components/ui/button"
import { DataTablePagination } from "@/components/shared/DataTablePagination"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { CategoryTable } from "./CategoryTable"
import { CategoryModalForm } from "./CategoryModalForm"
import { useCategories, useDeleteCategory } from "../hooks/useCategories"
import { useModalStore } from "@/stores/useModalStore"
import type { Category } from "@/types/master"

export function KategoriView() {
    // Pagination URL state via nuqs
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

    // Data fetching
    const { data: response, isLoading } = useCategories({
        page,
        perPage: 10,
    })

    const categories = response?.data || []
    const meta = response?.meta

    // Delete confirmation state via useModalStore
    const {
        isOpen,
        modalType,
        data: modalData,
        closeModal,
        openModal,
    } = useModalStore()
    const isDeleteModalOpen = isOpen && modalType === "confirmDeleteCategory"
    const categoryToDelete = modalData as Category | null
    const deleteMutation = useDeleteCategory()

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return
        deleteMutation.mutate(categoryToDelete.id, {
            onSuccess: () => closeModal(),
        })
    }

    return (
        <div className="space-y-4">
            {/* Action Bar & Heading */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Master Kategori
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Kelola data kategori untuk pengelompokan katalog barang
                        inventaris.
                    </p>
                </div>
                <Button
                    onClick={() => openModal("categoryForm")}
                    className="h-9 gap-1.5 font-medium"
                >
                    <span>Tambah Kategori</span>
                </Button>
            </div>

            {/* Data Table */}
            <CategoryTable
                data={categories}
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
            <CategoryModalForm />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={isDeleteModalOpen}
                onOpenChange={(open) => !open && closeModal()}
                title="Hapus Kategori?"
                description={`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.name || ""}"? Data yang sudah dihapus tidak dapat dipulihkan.`}
                confirmLabel="Hapus Data"
                cancelLabel="Batal"
                variant="destructive"
                isLoading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
