"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

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
import { barangSchema, type BarangFormValues } from "../schemas/barangSchema"
import { useCreateBarang, useUpdateBarang } from "../hooks/useBarangMutations"
import { useCategories } from "@/features/master/hooks/useCategories"
import { useUnits } from "@/features/master/hooks/useUnits"
import { mapServerErrorsToForm, ApiClientError } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import type { Item, ItemPayload } from "@/types/barang"

interface BarangFormProps {
    initialData?: Item | null
    isEdit?: boolean
    onCancel?: () => void
}

export function BarangForm({
    initialData,
    isEdit = false,
    onCancel,
}: BarangFormProps) {
    const router = useRouter()
    const createMutation = useCreateBarang()
    const updateMutation = useUpdateBarang()
    const isPending = createMutation.isPending || updateMutation.isPending

    const { data: categoryData } = useCategories({ all: true })
    const { data: unitData } = useUnits({ all: true })

    const categories = React.useMemo(() => {
        const list = categoryData?.data ? [...categoryData.data] : []
        if (
            initialData?.category &&
            !list.some((c) => c.id === initialData.category?.id)
        ) {
            list.unshift({
                id: initialData.category.id,
                name: initialData.category.name,
            } as any)
        }
        return list
    }, [categoryData?.data, initialData?.category])

    const units = React.useMemo(() => {
        const list = unitData?.data ? [...unitData.data] : []
        if (
            initialData?.unit &&
            !list.some((u) => u.id === initialData.unit?.id)
        ) {
            list.unshift({
                id: initialData.unit.id,
                name: initialData.unit.name,
                abbreviation: initialData.unit.abbreviation,
            } as any)
        }
        return list
    }, [unitData?.data, initialData?.unit])

    const {
        register,
        handleSubmit,
        reset,
        setError,
        control,
        formState: { errors },
    } = useForm<BarangFormValues>({
        resolver: zodResolver(barangSchema),
        mode: "onSubmit",
        defaultValues: {
            code: initialData?.code || "",
            name: initialData?.name || "",
            category_id:
                initialData?.category_id ?? initialData?.category?.id ?? 0,
            unit_id: initialData?.unit_id ?? initialData?.unit?.id ?? 0,
            price: Number(initialData?.price) || 0,
            stock: initialData?.stock || 0,
            minimum_stock: initialData?.minimum_stock ?? 5,
            description: initialData?.description || "",
        },
    })

    React.useEffect(() => {
        if (initialData) {
            reset({
                code: initialData.code || "",
                name: initialData.name || "",
                category_id:
                    initialData.category_id ?? initialData.category?.id ?? 0,
                unit_id: initialData.unit_id ?? initialData.unit?.id ?? 0,
                price: Number(initialData.price) || 0,
                stock: initialData.stock || 0,
                minimum_stock: initialData.minimum_stock ?? 5,
                description: initialData.description || "",
            })
        }
    }, [initialData, reset])

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        } else {
            router.push("/barang")
        }
    }

    const onSubmit = (values: BarangFormValues) => {
        const trimmedCode = values.code?.trim()

        if (isEdit && initialData) {
            if (!trimmedCode) {
                setError("code", {
                    message: "Kode barang / SKU wajib diisi saat mengubah data",
                })
                return
            }

            const payload: ItemPayload = {
                code: trimmedCode,
                name: values.name,
                category_id: Number(values.category_id),
                unit_id: Number(values.unit_id),
                price: Number(values.price),
                minimum_stock: Number(values.minimum_stock),
                description: values.description || undefined,
            }

            updateMutation.mutate(
                { id: initialData.id, payload },
                {
                    onSuccess: () => {
                        router.push("/barang")
                    },
                    onError: (err) => {
                        if (err instanceof ApiClientError && err.errors) {
                            mapServerErrorsToForm(err.errors, setError)
                        }
                    },
                }
            )
        } else {
            const payload: ItemPayload = {
                name: values.name,
                category_id: Number(values.category_id),
                unit_id: Number(values.unit_id),
                price: Number(values.price),
                stock: Number(values.stock || 0),
                minimum_stock: Number(values.minimum_stock),
                description: values.description || undefined,
            }

            if (trimmedCode) {
                payload.code = trimmedCode
            }

            createMutation.mutate(payload, {
                onSuccess: () => {
                    router.push("/barang")
                },
                onError: (err) => {
                    if (err instanceof ApiClientError && err.errors) {
                        mapServerErrorsToForm(err.errors, setError)
                    }
                },
            })
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="item-code">
                            Kode Barang{" "}
                            {isEdit && (
                                <span className="text-destructive">*</span>
                            )}
                        </Label>
                        {!isEdit && (
                            <span className="text-[11px] font-normal text-muted-foreground">
                                Opsional (Otomatis)
                            </span>
                        )}
                    </div>
                    <Input
                        id="item-code"
                        placeholder={
                            isEdit
                                ? "Misal: BRG-0001"
                                : "Kosongkan untuk otomatis (misal: BRG-0001)"
                        }
                        className="font-mono text-sm"
                        disabled={isPending}
                        aria-invalid={!!errors.code}
                        {...register("code")}
                    />
                    {errors.code && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.code.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="item-name">
                        Nama Barang <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="item-name"
                        placeholder="Misal: Kertas HVS A4 80gr Sinar Dunia"
                        disabled={isPending}
                        aria-invalid={!!errors.name}
                        {...register("name")}
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="item-category">
                        Kategori Barang{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        control={control}
                        name="category_id"
                        render={({ field }) => (
                            <Select
                                value={field.value ? String(field.value) : ""}
                                onValueChange={(val) =>
                                    field.onChange(Number(val))
                                }
                                items={categories.map((cat) => ({
                                    value: String(cat.id),
                                    label: cat.name,
                                }))}
                                disabled={isPending}
                            >
                                <SelectTrigger
                                    id="item-category"
                                    className="w-full"
                                    aria-invalid={!!errors.category_id}
                                >
                                    <SelectValue placeholder="Pilih Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.id}
                                            value={String(cat.id)}
                                        >
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.category_id && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.category_id.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="item-unit">
                        Satuan{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                        control={control}
                        name="unit_id"
                        render={({ field }) => (
                            <Select
                                value={field.value ? String(field.value) : ""}
                                onValueChange={(val) =>
                                    field.onChange(Number(val))
                                }
                                items={units.map((unit) => ({
                                    value: String(unit.id),
                                    label: `${unit.name} (${unit.abbreviation || "-"})`,
                                }))}
                                disabled={isPending}
                            >
                                <SelectTrigger
                                    id="item-unit"
                                    className="w-full"
                                    aria-invalid={!!errors.unit_id}
                                >
                                    <SelectValue placeholder="Pilih Satuan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem
                                            key={unit.id}
                                            value={String(unit.id)}
                                        >
                                            {unit.name} (
                                            {unit.abbreviation || "-"})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.unit_id && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.unit_id.message}
                        </p>
                    )}
                </div>
            </div>

            <div
                className={cn(
                    "grid grid-cols-1 gap-4",
                    isEdit ? "md:grid-cols-2" : "md:grid-cols-3"
                )}
            >
                <div className="space-y-1.5">
                    <Label htmlFor="item-price">
                        Harga Satuan (Rp){" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="item-price"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        className="font-mono"
                        disabled={isPending}
                        aria-invalid={!!errors.price}
                        {...register("price", { valueAsNumber: true })}
                    />
                    {errors.price && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.price.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="item-min-stock">
                        Minimum Stok{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="item-min-stock"
                        type="number"
                        min="0"
                        placeholder="5"
                        className="font-mono"
                        disabled={isPending}
                        aria-invalid={!!errors.minimum_stock}
                        {...register("minimum_stock", { valueAsNumber: true })}
                    />
                    <span className="block text-[11px] text-muted-foreground">
                        Batas pemicu status stok rendah.
                    </span>
                    {errors.minimum_stock && (
                        <p className="mt-1 text-xs font-medium text-destructive">
                            {errors.minimum_stock.message}
                        </p>
                    )}
                </div>

                {!isEdit && (
                    <div className="space-y-1.5">
                        <Label htmlFor="item-stock">
                            Stok Awal{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="item-stock"
                            type="number"
                            min="0"
                            placeholder="0"
                            className="font-mono"
                            disabled={isPending}
                            aria-invalid={!!errors.stock}
                            {...register("stock", { valueAsNumber: true })}
                        />
                        <span className="block text-[11px] text-muted-foreground">
                            Stok selanjutnya hanya dapat dimutasi lewat menu
                            transaksi.
                        </span>
                        {errors.stock && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.stock.message}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="item-desc">Deskripsi (Opsional)</Label>
                <Textarea
                    id="item-desc"
                    rows={3}
                    placeholder="Tambahkan detail spesifikasi atau catatan tambahan..."
                    disabled={isPending}
                    {...register("description")}
                />
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
                    <span>
                        {isEdit ? "Perbarui Data Barang" : "Simpan Barang"}
                    </span>
                </Button>
            </div>
        </form>
    )
}
