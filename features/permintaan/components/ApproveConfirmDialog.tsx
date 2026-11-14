"use client"

import * as React from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useModalStore } from "@/stores/useModalStore"
import { useApproveItemRequest } from "../hooks/useApproveItemRequest"
import type { ItemRequest } from "@/types/permintaan"

export function ApproveConfirmDialog() {
    const { isOpen, modalType, data, closeModal } = useModalStore()
    const isModalOpen = isOpen && modalType === "approveItemRequest"
    const targetRequest = data as ItemRequest | null

    const approveMutation = useApproveItemRequest()
    const isPending = approveMutation.isPending

    const handleConfirm = () => {
        if (!targetRequest) return

        approveMutation.mutate(targetRequest.id, {
            onSuccess: () => {
                closeModal()
            },
        })
    }

    const unitAbbr =
        targetRequest?.item?.unit?.abbreviation ||
        targetRequest?.item?.unit?.name ||
        ""

    return (
        <AlertDialog
            open={isModalOpen}
            onOpenChange={(open) => !open && closeModal()}
        >
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <div className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="size-5" />
                        <AlertDialogTitle>Setujui Permintaan Barang</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription
                        render={<div />}
                        className="space-y-3 pt-2 text-sm text-muted-foreground"
                    >
                        <p>
                            Apakah Anda yakin ingin menyetujui permintaan{" "}
                            <span className="font-mono font-semibold text-foreground">
                                {targetRequest?.request_code || "-"}
                            </span>{" "}
                            oleh{" "}
                            <span className="font-semibold text-foreground">
                                {targetRequest?.user?.name || "Staff"}
                            </span>
                            ?
                        </p>
                        <div className="space-y-1 rounded-lg border border-border bg-muted/30 p-3 text-xs">
                            <div>
                                <span className="text-muted-foreground">
                                    Barang:
                                </span>{" "}
                                <span className="font-medium text-foreground">
                                    {targetRequest?.item?.name || "-"}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Kuantitas:
                                </span>{" "}
                                <span className="font-mono font-semibold text-foreground tabular-nums">
                                    {targetRequest?.quantity || 0} {unitAbbr}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                            Perhatian: Menyetujui permintaan ini akan secara
                            otomatis memotong stok barang dan mencatat mutasi
                            transaksi keluar.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => closeModal()}
                        disabled={isPending}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isPending || !targetRequest}
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        {isPending && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        Konfirmasi Setujui
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
