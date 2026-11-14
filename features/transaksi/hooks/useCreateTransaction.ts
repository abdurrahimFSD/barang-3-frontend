import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { Transaction, TransactionPayload } from "@/types/transaction"

export function useCreateTransaction() {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation<
        ApiResponse<Transaction>,
        ApiClientError,
        TransactionPayload
    >({
        mutationFn: async (payload: TransactionPayload) => {
            return await apiClient.post<Transaction>("/transactions", payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            queryClient.invalidateQueries({ queryKey: ["items"] })
            toast.success(res.message || "Transaksi berhasil dicatat")
            router.push("/transaksi")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal mencatat transaksi")
            }
        },
    })
}
