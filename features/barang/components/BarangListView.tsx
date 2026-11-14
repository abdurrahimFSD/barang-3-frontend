"use client"

import * as React from "react"
import Link from "next/link"
import { useQueryState, parseAsInteger } from "nuqs"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DataTablePagination } from "@/components/shared/DataTablePagination"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { BarangFilter } from "./BarangFilter"
import { BarangTable } from "./BarangTable"
import { useBarangList } from "../hooks/useBarangList"
import { useDeleteBarang } from "../hooks/useBarangMutations"
import { useModalStore } from "@/stores/useModalStore"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import type { Item } from "@/types/barang"

export function BarangListView() {
    const [searchQuery] = useQueryState("search", { defaultValue: "" })
    const [categoryId] = useQueryState("category_id", { defaultValue: "" })
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
    const [sortBy, setSortBy] = useQueryState("sort_by", { defaultValue: "" })
    const [sortOrder, setSortOrder] = useQueryState("sort_order", { defaultValue: "" })

    const { isAdmin } = useCurrentUser()

    const activeSortOrder =
        sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined

    const handleSort = (column: string) => {
        if (sortBy !== column) {
            setSortBy(column)
            setSortOrder("asc")
        } else if (sortOrder === "asc") {
            setSortOrder("desc")
        } else {
            setSortBy(null)
            setSortOrder(null)
        }
        setPage(1)
    }

    const {
        data: response,
        isLoading,
        isPlaceholderData,
    } = useBarangList({
        search: searchQuery,
        category_id: categoryId || undefined,
        page,
        perPage: 10,
        sort_by: sortBy || undefined,
        sort_order: activeSortOrder,
    })

    const items = response?.data || []
    const meta = response?.meta

    const {
        isOpen,
        modalType,
        data: modalData,
        closeModal,
        openModal,
    } = useModalStore()
    const isDeleteModalOpen = isOpen && modalType === "confirmDeleteBarang"
    const itemToDelete = modalData as Item | null
    const deleteMutation = useDeleteBarang()

    const handleConfirmDelete = () => {
        if (!itemToDelete) return
        deleteMutation.mutate(itemToDelete.id, {
            onSuccess: () => closeModal(),
        })
    }

    return (
        <div className="space-y-4">
            {/* Header & Actions */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Katalog Barang
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Daftar katalog barang inventaris, ambang batas minimum,
                        dan pemantauan stok fisik.
                    </p>
                </div>

                {isAdmin && (
                    <Link
                        href="/barang/tambah"
                        className={cn(buttonVariants(), "h-9 font-medium")}
                    >
                        <span>Tambah Barang</span>
                    </Link>
                )}
            </div>

            {/* Filter Bar */}
            <BarangFilter />

            {/* Data Table */}
            <BarangTable
                data={items}
                isLoading={isLoading && !isPlaceholderData}
                page={page}
                perPage={10}
                sortBy={sortBy || undefined}
                sortOrder={activeSortOrder}
                onSort={handleSort}
            />

            {/* Pagination */}
            <DataTablePagination
                meta={meta}
                onPageChange={(newPage) => setPage(newPage)}
                isLoading={isLoading || isPlaceholderData}
            />

            {/* Admin Delete Confirmation Modal */}
            {isAdmin && (
                <ConfirmDialog
                    open={isDeleteModalOpen}
                    onOpenChange={(open) => !open && closeModal()}
                    title="Hapus Barang?"
                    description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.name || ""}" (${itemToDelete?.code || ""})? Aksi ini akan dibatalkan jika barang sudah memiliki riwayat mutasi transaksi.`}
                    confirmLabel="Hapus Barang"
                    cancelLabel="Batal"
                    variant="destructive"
                    isLoading={deleteMutation.isPending}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    )
}
