import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { Category, CategoryPayload } from "@/types/master"

interface UseCategoriesParams {
    search?: string
    page?: number
    perPage?: number
    all?: boolean
}

export function useCategories({
    search = "",
    page = 1,
    perPage = 10,
    all = false,
}: UseCategoriesParams = {}) {
    return useQuery({
        queryKey: ["categories", { search, page, perPage, all }],
        queryFn: async () => {
            const response = await apiClient.get<Category[]>("/categories", {
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

export function useCreateCategory() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<Category>, ApiClientError, CategoryPayload>({
        mutationFn: async (payload: CategoryPayload) => {
            return await apiClient.post<Category>("/categories", payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success(res.message || "Kategori berhasil ditambahkan")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal menambahkan kategori")
            }
        },
    })
}

export function useUpdateCategory() {
    const queryClient = useQueryClient()

    return useMutation<
        ApiResponse<Category>,
        ApiClientError,
        { id: number; payload: CategoryPayload }
    >({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number
            payload: CategoryPayload
        }) => {
            return await apiClient.put<Category>(`/categories/${id}`, payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success(res.message || "Kategori berhasil diperbarui")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal memperbarui kategori")
            }
        },
    })
}

export function useDeleteCategory() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<null>, ApiClientError, number>({
        mutationFn: async (id: number) => {
            return await apiClient.delete<null>(`/categories/${id}`)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success(res.message || "Kategori berhasil dihapus")
        },
        onError: (error: ApiClientError) => {
            toast.error(error.message || "Gagal menghapus kategori")
        },
    })
}
