"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useModalStore } from "@/stores/useModalStore"
import { unitSchema, type UnitFormValues } from "../schemas/unitSchema"
import { useCreateUnit, useUpdateUnit } from "../hooks/useUnits"
import { mapServerErrorsToForm, ApiClientError } from "@/lib/api-client"
import type { Unit } from "@/types/master"

export function UnitModalForm() {
    const { isOpen, modalType, data, closeModal } = useModalStore()
    const isModalOpen = isOpen && modalType === "unitForm"
    const editingUnit = data as Unit | null
    const isEditMode = !!editingUnit

    const createMutation = useCreateUnit()
    const updateMutation = useUpdateUnit()
    const isPending = createMutation.isPending || updateMutation.isPending

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<UnitFormValues>({
        resolver: zodResolver(unitSchema),
        mode: "onSubmit",
        defaultValues: {
            name: "",
            abbreviation: "",
        },
    })

    React.useEffect(() => {
        if (isModalOpen) {
            if (editingUnit) {
                reset({
                    name: editingUnit.name,
                    abbreviation: editingUnit.abbreviation || "",
                })
            } else {
                reset({
                    name: "",
                    abbreviation: "",
                })
            }
        }
    }, [isModalOpen, editingUnit, reset])

    const onSubmit = (values: UnitFormValues) => {
        const payload = {
            name: values.name,
            abbreviation: values.abbreviation || undefined,
        }

        if (isEditMode) {
            updateMutation.mutate(
                { id: editingUnit.id, payload },
                {
                    onSuccess: () => closeModal(),
                    onError: (err) => {
                        if (err instanceof ApiClientError && err.errors) {
                            mapServerErrorsToForm(err.errors, setError)
                        }
                    },
                }
            )
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => closeModal(),
                onError: (err) => {
                    if (err instanceof ApiClientError && err.errors) {
                        mapServerErrorsToForm(err.errors, setError)
                    }
                },
            })
        }
    }

    return (
        <Dialog
            open={isModalOpen}
            onOpenChange={(open) => !open && closeModal()}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Ubah Satuan" : "Tambah Satuan Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Perbarui nama dan singkatan satuan pengukuran inventaris."
                            : "Masukkan nama dan singkatan satuan baru untuk penandaan kuantitas barang."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="unit-name">
                            Nama Satuan{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="unit-name"
                            placeholder="Misal: Pieces, Box, Kilogram, Rim"
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
                        <Label htmlFor="unit-abbreviation">
                            Singkatan / Kode Satuan
                        </Label>
                        <Input
                            id="unit-abbreviation"
                            placeholder="Misal: pcs, box, kg, rim"
                            className="font-mono text-sm"
                            disabled={isPending}
                            aria-invalid={!!errors.abbreviation}
                            {...register("abbreviation")}
                        />
                        {errors.abbreviation && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.abbreviation.message}
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
                        <Button type="submit" disabled={isPending}>
                            {isPending && (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            )}
                            {isEditMode ? "Simpan Perubahan" : "Tambah Satuan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
