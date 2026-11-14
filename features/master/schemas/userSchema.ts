import { z } from "zod"

export const createUserSchema = z.object({
    name: z
        .string()
        .min(1, "Nama wajib diisi")
        .max(255, "Maksimal 255 karakter"),
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    role: z.enum(["admin", "staff"]),
})

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(1, "Nama wajib diisi")
        .max(255, "Maksimal 255 karakter"),
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email tidak valid"),
    password: z
        .string()
        .refine((val) => !val || val.length >= 6, {
            message: "Password minimal 6 karakter",
        })
        .optional()
        .or(z.literal("")),
    role: z.enum(["admin", "staff"]),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
export type UserFormValues = {
    name: string
    email: string
    password?: string
    role: "admin" | "staff"
}
