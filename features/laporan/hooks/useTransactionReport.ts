import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { TransactionReportItem } from "@/types/report"

interface UseTransactionReportParams {
    start_date?: string | null
    end_date?: string | null
    type?: string | null
    all?: boolean
}

export function useTransactionReport(params: UseTransactionReportParams = {}) {
    const { start_date, end_date, type, all = true } = params

    return useQuery<ApiResponse<TransactionReportItem[]>>({
        queryKey: [
            "reports",
            "transactions",
            { start_date, end_date, type, all },
        ],
        queryFn: async () => {
            const response = await apiClient.get<TransactionReportItem[]>(
                "/reports/transactions",
                {
                    params: {
                        start_date: start_date || undefined,
                        end_date: end_date || undefined,
                        type: type || undefined,
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
