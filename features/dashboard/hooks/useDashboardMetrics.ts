import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { DashboardMetrics, DashboardPeriod } from "@/types/dashboard"

export function useDashboardMetrics(period: DashboardPeriod = "6m") {
    return useQuery<ApiResponse<DashboardMetrics>>({
        queryKey: ["dashboard", "metrics", period],
        queryFn: async () => {
            const response = await apiClient.get<DashboardMetrics>(
                "/dashboard/metrics",
                {
                    params: { period },
                }
            )
            return response
        },
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: true,
    })
}
