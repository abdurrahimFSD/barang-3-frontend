"use client"

import * as React from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ItemSelect } from "./ItemSelect"
import {
    transactionSchema,
    type TransactionFormValues,
} from "../schemas/transactionSchema"
import { useCreateTransaction } from "../hooks/useCreateTransaction"
import { mapServerErrorsToForm, ApiClientError } from "@/lib/api-client"
import { formatDateInput } from "@/lib/formatters"
import type { Item } from "@/types/barang"
import type { TransactionPayload } from "@/types/transaction"

interface TransaksiFormProps {
    onCancel?: () => void
}

const TYPE_OPTIONS = [
    { value: "masuk", label: "Barang Masuk" },
    { value: "keluar", label: "Barang Keluar" },
]

export function TransaksiForm({ onCancel }: TransaksiFormProps = {}) {
    const router = useRouter()
    const createMutation = useCreateTransaction()
    const isPending = createMutation.isPending

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            router.push("/transaksi")
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
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        mode: "onSubmit",
        defaultValues: {
            type: "masuk",
            item_id: 0,
            quantity: 1,
            date: formatDateInput(),
            notes: "",
        },
    })

    const currentType = useWatch({
        control,
        name: "type",
        defaultValue: "masuk",
    })

    const onSubmit = (values: TransactionFormValues) => {
        // Validation: If type is 'keluar', quantity cannot exceed current stock
        if (values.type === "keluar" && selectedItemState) {
            if (values.quantity > selectedItemState.stock) {
                setError("quantity", {
                    type: "manual",
                    message: `Jumlah pengeluaran melebihi sisa stok saat ini (${selectedItemState.stock} ${selectedItemState.unit?.abbreviation || selectedItemState.unit?.name || ""})`,
                })
                return
            }
        }

        const payload: TransactionPayload = {
            type: values.type,
            item_id: values.item_id,
            quantity: values.quantity,
            date: values.date,
            notes: values.notes || undefined,
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
                    <Label htmlFor="trx-type">
                        Tipe Mutasi Transaksi{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                items={TYPE_OPTIONS}
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={isPending}
                            >
                                <SelectTrigger
                                    id="trx-type"
                                    className="w-full"
                                    aria-invalid={!!errors.type}
                                >
                                    <SelectValue placeholder="Pilih Tipe Mutasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TYPE_OPTIONS.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.type && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.type.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="transaction-item">
                        Pilih Barang <span className="text-destructive">*</span>
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
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="trx-date">
                        Tanggal Transaksi{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="trx-date"
                        type="date"
                        className="font-mono"
                        disabled={isPending}
                        aria-invalid={!!errors.date}
                        {...register("date")}
                    />
                    {errors.date && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.date.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="trx-quantity">
                        Jumlah Kuantitas{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="trx-quantity"
                        type="number"
                        min={1}
                        placeholder="1"
                        className="font-mono tabular-nums"
                        disabled={isPending}
                        aria-invalid={!!errors.quantity}
                        {...register("quantity", { valueAsNumber: true })}
                    />
                    {currentType === "keluar" && selectedItemState && (
                        <span className="block text-[11px] text-muted-foreground">
                            Batas maksimal pengeluaran:{" "}
                            {selectedItemState.stock}{" "}
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
                <Label htmlFor="trx-notes">
                    Catatan / Keterangan Transaksi (Opsional)
                </Label>
                <Textarea
                    id="trx-notes"
                    placeholder="Contoh: Pengadaan batch awal tahun, distribusi divisi umum, dsb. (opsional)"
                    rows={3}
                    disabled={isPending}
                    aria-invalid={!!errors.notes}
                    {...register("notes")}
                />
                {errors.notes && (
                    <p className="mt-1 text-xs font-medium text-destructive">
                        {errors.notes.message}
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
                    {isPending && <Loader2 className="size-4 animate-spin" />}
                    <span>Simpan Transaksi</span>
                </Button>
            </div>
        </form>
    )
}
