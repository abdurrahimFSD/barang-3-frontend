"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Loader2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useModalStore } from "@/stores/useModalStore"
import { rejectSchema, type RejectFormValues } from "../schemas/rejectSchema"
import { useRejectItemRequest } from "../hooks/useRejectItemRequest"
import type { ItemRequest } from "@/types/permintaan"

export function RejectModalDialog() {
    const { isOpen, modalType, data, closeModal } = useModalStore()
    const isModalOpen = isOpen && modalType === "rejectItemRequest"
    const targetRequest = data as ItemRequest | null

    const rejectMutation = useRejectItemRequest()
    const isPending = rejectMutation.isPending

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RejectFormValues>({
        resolver: zodResolver(rejectSchema),
        mode: "onSubmit",
        defaultValues: {
            rejection_reason: "",
        },
    })

    React.useEffect(() => {
        if (isModalOpen) {
            reset({ rejection_reason: "" })
        }
    }, [isModalOpen, reset])

    const onSubmit = (values: RejectFormValues) => {
        if (!targetRequest) return

        rejectMutation.mutate(
            {
                id: targetRequest.id,
                payload: { rejection_reason: values.rejection_reason },
            },
            {
                onSuccess: () => {
                    closeModal()
                },
            }
        )
    }

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={(open) => !open && closeModal()}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="size-5" />
                        <DialogTitle>Tolak Permintaan Barang</DialogTitle>
                    </div>
                    <DialogDescription>
                        Berikan alasan penolakan untuk permintaan{" "}
                        <span className="font-mono font-semibold text-foreground">
                            {targetRequest?.request_code || "-"}
                        </span>{" "}
                        ({targetRequest?.item?.name || "Barang"}).
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    <div className="space-y-2">
                        <Label htmlFor="rejection-reason">
                            Alasan Penolakan{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="rejection-reason"
                            placeholder="Contoh: Stok barang saat ini diprioritaskan untuk kebutuhan darurat divisi logistik (minimal 5 karakter)..."
                            rows={4}
                            disabled={isPending}
                            aria-invalid={!!errors.rejection_reason}
                            {...register("rejection_reason")}
                        />
                        {errors.rejection_reason && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.rejection_reason.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => closeModal()}
                            disabled={isPending}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending || !targetRequest}
                        >
                            {isPending && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}
                            Konfirmasi Tolak
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
