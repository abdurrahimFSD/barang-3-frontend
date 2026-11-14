import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { StockReportItem } from "@/types/report"

interface UseStockReportParams {
    category_id?: string | number | null
    all?: boolean
}

export function useStockReport({
    category_id,
    all = true,
}: UseStockReportParams = {}) {
    return useQuery<ApiResponse<StockReportItem[]>>({
        queryKey: ["reports", "stock", { category_id, all }],
        queryFn: async () => {
            const response = await apiClient.get<StockReportItem[]>(
                "/reports/stock",
                {
                    params: {
                        category_id: category_id
                            ? String(category_id)
                            : undefined,
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
