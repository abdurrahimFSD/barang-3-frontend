import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { ItemRequest } from "@/types/permintaan"

export function useItemRequestDetail(id: number) {
    return useQuery<ApiResponse<ItemRequest>>({
        queryKey: ["item-requests", id],
        queryFn: async () => {
            const response = await apiClient.get<ItemRequest>(
                `/item-requests/${id}`
            )
            return response
        },
        enabled: !Number.isNaN(id) && id > 0,
        staleTime: 60 * 1000,
    })
}
