import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"

export function useMarkAllAsRead() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<null>, ApiClientError, void>({
        mutationFn: async () => {
            return await apiClient.patch<null>("/notifications/read-all")
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
            queryClient.invalidateQueries({
                queryKey: ["notifications", "unread-count"],
            })
            toast.success(
                res.message || "Semua notifikasi ditandai telah dibaca"
            )
        },
        onError: (error: ApiClientError) => {
            toast.error(error.message || "Gagal menandai semua notifikasi")
        },
    })
}
