import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Item } from "@/types/barang"

interface UseBarangListParams {
    search?: string
    category_id?: string | number | null
    page?: number
    perPage?: number
    sort_by?: string
    sort_order?: "asc" | "desc"
}

export function useBarangList({
    search = "",
    category_id,
    page = 1,
    perPage = 10,
    sort_by,
    sort_order,
}: UseBarangListParams = {}) {
    return useQuery({
        queryKey: ["items", { search, category_id, page, perPage, sort_by, sort_order }],
        queryFn: async () => {
            const response = await apiClient.get<Item[]>("/items", {
                params: {
                    search: search || undefined,
                    category_id: category_id ? String(category_id) : undefined,
                    page,
                    per_page: perPage,
                    sort_by: sort_by || undefined,
                    sort_order: sort_order || undefined,
                },
            })
            return response
        },
        staleTime: 60 * 1000,
        placeholderData: keepPreviousData,
    })
}
