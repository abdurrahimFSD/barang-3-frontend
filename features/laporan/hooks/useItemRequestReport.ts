import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { ItemRequestReportItem } from "@/types/report"

interface UseItemRequestReportParams {
    start_date?: string | null
    end_date?: string | null
    status?: string | null
    all?: boolean
}

export function useItemRequestReport(params: UseItemRequestReportParams = {}) {
    const { start_date, end_date, status, all = true } = params

    return useQuery<ApiResponse<ItemRequestReportItem[]>>({
        queryKey: [
            "reports",
            "item-requests",
            { start_date, end_date, status, all },
        ],
        queryFn: async () => {
            const response = await apiClient.get<ItemRequestReportItem[]>(
                "/reports/item-requests",
                {
                    params: {
                        start_date: start_date || undefined,
                        end_date: end_date || undefined,
                        status: status || undefined,
                        all: all ? "1" : undefined,
                    },
                }
            )
            return response
        },
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    })
}
