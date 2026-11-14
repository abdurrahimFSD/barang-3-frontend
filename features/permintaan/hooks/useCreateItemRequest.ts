import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { ItemRequest, ItemRequestPayload } from "@/types/permintaan"

export function useCreateItemRequest() {
    const queryClient = useQueryClient()
    const router = useRouter()

    return useMutation<
        ApiResponse<ItemRequest>,
        ApiClientError,
        ItemRequestPayload
    >({
        mutationFn: async (payload: ItemRequestPayload) => {
            return await apiClient.post<ItemRequest>("/item-requests", payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["item-requests"] })
            toast.success(res.message || "Permintaan barang berhasil dikirim")
            router.push("/permintaan")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(
                    error.message || "Gagal mengajukan permintaan barang"
                )
            }
        },
    })
}
