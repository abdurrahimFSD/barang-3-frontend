import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ApiClientError } from "@/lib/api-client"
import type { LoginFormValues } from "../schemas/authSchema"
import type { ApiResponse } from "@/types/api"
import type { User } from "@/types/auth"

interface LoginResponse {
    user: User
}

export function useLogin() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()
    const redirectUrl = searchParams.get("from") || "/dashboard"

    return useMutation<
        ApiResponse<LoginResponse>,
        ApiClientError,
        LoginFormValues
    >({
        mutationFn: async (payload: LoginFormValues) => {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            })

            const data: ApiResponse<LoginResponse> = await response.json()

            if (!response.ok) {
                const errData = data as unknown as {
                    errors?: Record<string, string[]>
                }
                throw new ApiClientError(
                    data.message || "Login gagal",
                    response.status,
                    errData.errors
                )
            }

            return data
        },
        onSuccess: (res) => {
            queryClient.setQueryData(["auth", "me"], res.data.user)
            toast.success(`Selamat datang, ${res.data.user.name}`)
            router.push(redirectUrl)
            router.refresh()
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal masuk ke sistem")
            }
        },
    })
}
