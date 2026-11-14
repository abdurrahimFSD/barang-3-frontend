import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { AppNotification } from "@/types/notification"

export function useNotifications() {
    return useQuery<ApiResponse<AppNotification[]>>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response =
                await apiClient.get<AppNotification[]>("/notifications")
            return response
        },
        staleTime: 10000,
    })
}
