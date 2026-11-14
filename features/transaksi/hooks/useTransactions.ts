import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Transaction, TransactionQueryParams } from "@/types/transaction"

export function useTransactions(params: TransactionQueryParams = {}) {
    const {
        type,
        start_date,
        end_date,
        item_id,
        user_id,
        search = "",
        page = 1,
        per_page = 10,
    } = params

    return useQuery({
        queryKey: [
            "transactions",
            { type, start_date, end_date, item_id, user_id, search, page, per_page },
        ],
        queryFn: async () => {
            const response = await apiClient.get<Transaction[]>(
                "/transactions",
                {
                    params: {
                        type: type || undefined,
                        start_date: start_date || undefined,
                        end_date: end_date || undefined,
                        item_id: item_id || undefined,
                        user_id: user_id || undefined,
                        search: search || undefined,
                        page,
                        per_page,
                    },
                }
            )
            return response
        },
        staleTime: 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
