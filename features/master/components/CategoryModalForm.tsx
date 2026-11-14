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
import { Textarea } from "@/components/ui/textarea"
import { useModalStore } from "@/stores/useModalStore"
import {
    categorySchema,
    type CategoryFormValues,
} from "../schemas/categorySchema"
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories"
import { mapServerErrorsToForm, ApiClientError } from "@/lib/api-client"
import type { Category } from "@/types/master"

export function CategoryModalForm() {
    const { isOpen, modalType, data, closeModal } = useModalStore()
    const isModalOpen = isOpen && modalType === "categoryForm"
    const editingCategory = data as Category | null
    const isEditMode = !!editingCategory

    const createMutation = useCreateCategory()
    const updateMutation = useUpdateCategory()
    const isPending = createMutation.isPending || updateMutation.isPending

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        mode: "onSubmit",
        defaultValues: {
            name: "",
            description: "",
        },
    })

    React.useEffect(() => {
        if (isModalOpen) {
            if (editingCategory) {
                reset({
                    name: editingCategory.name,
                    description: editingCategory.description || "",
                })
            } else {
                reset({
                    name: "",
                    description: "",
                })
            }
        }
    }, [isModalOpen, editingCategory, reset])

    const onSubmit = (values: CategoryFormValues) => {
        const payload = {
            name: values.name,
            description: values.description || undefined,
        }

        if (isEditMode) {
            updateMutation.mutate(
                { id: editingCategory.id, payload },
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
                        {isEditMode ? "Ubah Kategori" : "Tambah Kategori Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Perbarui informasi nama dan deskripsi kategori inventaris."
                            : "Masukkan nama dan deskripsi kategori baru untuk pengelompokan barang."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="category-name">
                            Nama Kategori{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="category-name"
                            placeholder="Misal: Elektronik, Alat Tulis Kantor"
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
                        <Label htmlFor="category-description">Deskripsi</Label>
                        <Textarea
                            id="category-description"
                            placeholder="Deskripsi singkat kategori (opsional)"
                            disabled={isPending}
                            rows={3}
                            aria-invalid={!!errors.description}
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.description.message}
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
                            {isEditMode
                                ? "Simpan Perubahan"
                                : "Tambah Kategori"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
