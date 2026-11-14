import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { UnreadCountResponse } from "@/types/notification"

export function useUnreadCount() {
    return useQuery<ApiResponse<UnreadCountResponse>>({
        queryKey: ["notifications", "unread-count"],
        queryFn: async () => {
            const response = await apiClient.get<UnreadCountResponse>(
                "/notifications/unread-count"
            )
            return response
        },
        refetchInterval: 30000,
        staleTime: 25000,
        refetchOnWindowFocus: true,
    })
}
