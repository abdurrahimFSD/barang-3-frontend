"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ItemSelect } from "@/features/transaksi/components/ItemSelect"
import {
    permintaanSchema,
    type PermintaanFormValues,
} from "../schemas/permintaanSchema"
import { useCreateItemRequest } from "../hooks/useCreateItemRequest"
import { mapServerErrorsToForm, ApiClientError } from "@/lib/api-client"
import type { Item } from "@/types/barang"
import type { ItemRequestPayload } from "@/types/permintaan"

interface PermintaanFormProps {
    onCancel?: () => void
}

export function PermintaanForm({ onCancel }: PermintaanFormProps = {}) {
    const router = useRouter()
    const createMutation = useCreateItemRequest()
    const isPending = createMutation.isPending

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            router.push("/permintaan")
        }
    }

    const [selectedItemState, setSelectedItemState] = React.useState<
        Item | undefined
    >(undefined)

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<PermintaanFormValues>({
        resolver: zodResolver(permintaanSchema),
        mode: "onSubmit",
        defaultValues: {
            item_id: 0,
            quantity: 1,
            purpose: "",
        },
    })

    const onSubmit = (values: PermintaanFormValues) => {
        // Validation: Quantity cannot exceed current stock
        if (selectedItemState) {
            if (values.quantity > selectedItemState.stock) {
                setError("quantity", {
                    type: "manual",
                    message: `Jumlah permintaan melebihi sisa stok saat ini (${selectedItemState.stock} ${selectedItemState.unit?.abbreviation || selectedItemState.unit?.name || ""})`,
                })
                return
            }
        }

        const payload: ItemRequestPayload = {
            item_id: values.item_id,
            quantity: values.quantity,
            purpose: values.purpose,
        }

        createMutation.mutate(payload, {
            onError: (err) => {
                if (err instanceof ApiClientError && err.errors) {
                    mapServerErrorsToForm(err.errors, setError)
                }
            },
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="transaction-item">
                        Pilih Barang Inventaris{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="item_id"
                        control={control}
                        render={({ field }) => (
                            <ItemSelect
                                value={field.value}
                                onChange={(id, item) => {
                                    field.onChange(id)
                                    setSelectedItemState(item)
                                }}
                                disabled={isPending}
                                ariaInvalid={!!errors.item_id}
                            />
                        )}
                    />
                    {errors.item_id && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.item_id.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="req-quantity">
                        Jumlah Permintaan{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="req-quantity"
                        type="number"
                        min={1}
                        placeholder="1"
                        className="font-mono tabular-nums"
                        disabled={isPending}
                        aria-invalid={!!errors.quantity}
                        {...register("quantity", { valueAsNumber: true })}
                    />
                    {selectedItemState && (
                        <span className="block text-[11px] text-muted-foreground">
                            Batas maksimal permintaan: {selectedItemState.stock}{" "}
                            {selectedItemState.unit?.abbreviation ||
                                selectedItemState.unit?.name ||
                                ""}
                        </span>
                    )}
                    {errors.quantity && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.quantity.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="req-purpose">
                    Keperluan / Alasan Permintaan{" "}
                    <span className="text-destructive">*</span>
                </Label>
                <Textarea
                    id="req-purpose"
                    placeholder="Jelaskan kebutuhan operasional atas barang yang diajukan (minimal 5 karakter)..."
                    rows={4}
                    disabled={isPending}
                    aria-invalid={!!errors.purpose}
                    {...register("purpose")}
                />
                {errors.purpose && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                        {errors.purpose.message}
                    </p>
                )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isPending}
                    className="w-full sm:w-auto"
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full gap-2 font-medium sm:w-auto"
                >
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Send className="size-4" />
                    )}
                    <span>Kirim Permintaan</span>
                </Button>
            </div>
        </form>
    )
}
