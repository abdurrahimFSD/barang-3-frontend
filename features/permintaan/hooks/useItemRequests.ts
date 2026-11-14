import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { ItemRequest, ItemRequestQueryParams } from "@/types/permintaan"

export function useItemRequests(params: ItemRequestQueryParams = {}) {
    const {
        status,
        user_id,
        start_date,
        end_date,
        search = "",
        page = 1,
        per_page = 10,
    } = params

    return useQuery({
        queryKey: [
            "item-requests",
            { status, user_id, start_date, end_date, search, page, per_page },
        ],
        queryFn: async () => {
            const response = await apiClient.get<ItemRequest[]>(
                "/item-requests",
                {
                    params: {
                        status: status || undefined,
                        user_id: user_id || undefined,
                        start_date: start_date || undefined,
                        end_date: end_date || undefined,
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
