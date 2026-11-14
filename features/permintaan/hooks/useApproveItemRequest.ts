import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { ItemRequest } from "@/types/permintaan"

export function useApproveItemRequest() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<ItemRequest>, ApiClientError, number>({
        mutationFn: async (id: number) => {
            return await apiClient.post<ItemRequest>(
                `/item-requests/${id}/approve`
            )
        },
        onSuccess: (res, id) => {
            queryClient.invalidateQueries({ queryKey: ["item-requests"] })
            queryClient.invalidateQueries({ queryKey: ["item-requests", id] })
            queryClient.invalidateQueries({ queryKey: ["items"] })
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            toast.success(res.message || "Permintaan barang berhasil disetujui")
        },
        onError: (error: ApiClientError) => {
            toast.error(error.message || "Gagal menyetujui permintaan barang")
        },
    })
}
