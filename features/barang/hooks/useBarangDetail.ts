import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { Item } from "@/types/barang"

export function useBarangDetail(id: number | string | undefined) {
    return useQuery<Item | null>({
        queryKey: ["items", id],
        queryFn: async () => {
            if (!id) return null
            const response = await apiClient.get<Item>(`/items/${id}`)
            return response.data
        },
        enabled: !!id,
        staleTime: 30 * 1000,
    })
}
