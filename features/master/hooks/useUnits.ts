import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { Unit, UnitPayload } from "@/types/master"

interface UseUnitsParams {
    search?: string
    page?: number
    perPage?: number
    all?: boolean
}

export function useUnits({
    search = "",
    page = 1,
    perPage = 10,
    all = false,
}: UseUnitsParams = {}) {
    return useQuery({
        queryKey: ["units", { search, page, perPage, all }],
        queryFn: async () => {
            const response = await apiClient.get<Unit[]>("/units", {
                params: {
                    search: search || undefined,
                    page: all ? undefined : page,
                    per_page: all ? undefined : perPage,
                    all: all ? true : undefined,
                },
            })
            return response
        },
        staleTime: 60 * 1000,
    })
}

export function useCreateUnit() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<Unit>, ApiClientError, UnitPayload>({
        mutationFn: async (payload: UnitPayload) => {
            return await apiClient.post<Unit>("/units", payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["units"] })
            toast.success(res.message || "Satuan berhasil ditambahkan")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal menambahkan satuan")
            }
        },
    })
}

export function useUpdateUnit() {
    const queryClient = useQueryClient()

    return useMutation<
        ApiResponse<Unit>,
        ApiClientError,
        { id: number; payload: UnitPayload }
    >({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number
            payload: UnitPayload
        }) => {
            return await apiClient.put<Unit>(`/units/${id}`, payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["units"] })
            toast.success(res.message || "Satuan berhasil diperbarui")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal memperbarui satuan")
            }
        },
    })
}

export function useDeleteUnit() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<null>, ApiClientError, number>({
        mutationFn: async (id: number) => {
            return await apiClient.delete<null>(`/units/${id}`)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["units"] })
            toast.success(res.message || "Satuan berhasil dihapus")
        },
        onError: (error: ApiClientError) => {
            toast.error(error.message || "Gagal menghapus satuan")
        },
    })
}
