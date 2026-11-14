import { z } from "zod"

export const rejectSchema = z.object({
    rejection_reason: z
        .string()
        .min(5, "Alasan penolakan minimal 5 karakter")
        .max(500, "Maksimal 500 karakter"),
})

export type RejectFormValues = z.infer<typeof rejectSchema>
