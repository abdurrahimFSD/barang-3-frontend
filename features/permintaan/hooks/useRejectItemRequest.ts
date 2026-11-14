import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { ItemRequest, RejectItemRequestPayload } from "@/types/permintaan"

export function useRejectItemRequest() {
    const queryClient = useQueryClient()

    return useMutation<
        ApiResponse<ItemRequest>,
        ApiClientError,
        {
            id: number
            payload: RejectItemRequestPayload
        }
    >({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number
            payload: RejectItemRequestPayload
        }) => {
            return await apiClient.post<ItemRequest>(
                `/item-requests/${id}/reject`,
                payload
            )
        },
        onSuccess: (res, variables) => {
            queryClient.invalidateQueries({ queryKey: ["item-requests"] })
            queryClient.invalidateQueries({
                queryKey: ["item-requests", variables.id],
            })
            toast.success(res.message || "Permintaan barang telah ditolak")
        },
        onError: (error: ApiClientError) => {
            toast.error(error.message || "Gagal menolak permintaan barang")
        },
    })
}
