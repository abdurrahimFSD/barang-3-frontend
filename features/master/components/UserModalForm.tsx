"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/shared/PasswordInput"
import { useModalStore } from "@/stores/useModalStore"
import {
    createUserSchema,
    updateUserSchema,
    type UserFormValues,
} from "../schemas/userSchema"
import { useCreateUser, useUpdateUser } from "../hooks/useUsers"
import { mapServerErrorsToForm, ApiClientError } from "@/lib/api-client"
import type { User, UserRole } from "@/types/auth"

export function UserModalForm() {
    const { isOpen, modalType, data, closeModal } = useModalStore()
    const isModalOpen = isOpen && modalType === "userForm"
    const editingUser = data as User | null
    const isEditMode = !!editingUser

    const createMutation = useCreateUser()
    const updateMutation = useUpdateUser()
    const isPending = createMutation.isPending || updateMutation.isPending

    const {
        register,
        handleSubmit,
        reset,
        setError,
        control,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(isEditMode ? updateUserSchema : createUserSchema),
        mode: "onSubmit",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "staff",
        },
    })

    React.useEffect(() => {
        if (isModalOpen) {
            if (editingUser) {
                reset({
                    name: editingUser.name,
                    email: editingUser.email,
                    password: "",
                    role: editingUser.role,
                })
            } else {
                reset({
                    name: "",
                    email: "",
                    password: "",
                    role: "staff",
                })
            }
        }
    }, [isModalOpen, editingUser, reset])

    const onSubmit = (values: UserFormValues) => {
        if (isEditMode && editingUser) {
            const payload = {
                name: values.name,
                email: values.email,
                role: values.role as UserRole,
                password: values.password || undefined,
            }

            updateMutation.mutate(
                { id: editingUser.id, payload },
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
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password || "",
                role: values.role as UserRole,
            }

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
                        {isEditMode
                            ? "Ubah Akun Pengguna"
                            : "Tambah Pengguna Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Perbarui informasi akun dan hak akses pengguna sistem."
                            : "Daftarkan akun pengguna baru dengan menetapkan role hak akses."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="user-name">
                            Nama Lengkap{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="user-name"
                            placeholder="Misal: Ahmad Fauzi"
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
                        <Label htmlFor="user-email">
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="user-email"
                            type="email"
                            placeholder="nama@instansi.com"
                            disabled={isPending}
                            aria-invalid={!!errors.email}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="user-password">
                            Password{" "}
                            {isEditMode ? (
                                "(Opsional)"
                            ) : (
                                <span className="text-destructive">*</span>
                            )}
                        </Label>
                        <PasswordInput
                            id="user-password"
                            placeholder={
                                isEditMode
                                    ? "Kosongkan jika tidak diubah"
                                    : "Minimal 6 karakter"
                            }
                            disabled={isPending}
                            aria-invalid={!!errors.password}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="user-role">
                            Role / Hak Akses{" "}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={(val) => field.onChange(val)}
                                    disabled={isPending}
                                >
                                    <SelectTrigger
                                        id="user-role"
                                        className="w-full"
                                        aria-invalid={!!errors.role}
                                    >
                                        <SelectValue placeholder="Pilih hak akses role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            Administrator (Akses Penuh)
                                        </SelectItem>
                                        <SelectItem value="staff">
                                            Staff Operasional (Akses Terbatas)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.role && (
                            <p className="mt-1 text-xs font-medium text-destructive">
                                {errors.role.message}
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
                                : "Tambah Pengguna"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
