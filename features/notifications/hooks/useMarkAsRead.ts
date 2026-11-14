import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"

export function useMarkAsRead() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<null>, ApiClientError, number>({
        mutationFn: async (id: number) => {
            return await apiClient.patch<null>(`/notifications/${id}/read`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
            queryClient.invalidateQueries({
                queryKey: ["notifications", "unread-count"],
            })
        },
    })
}
