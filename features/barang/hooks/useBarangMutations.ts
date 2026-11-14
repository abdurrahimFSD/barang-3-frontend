import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { Item, ItemPayload } from "@/types/barang"

export function useCreateBarang() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<Item>, ApiClientError, ItemPayload>({
        mutationFn: async (payload: ItemPayload) => {
            return await apiClient.post<Item>("/items", payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["items"] })
            toast.success(res.message || "Barang berhasil ditambahkan")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal menambahkan barang")
            }
        },
    })
}

export function useUpdateBarang() {
    const queryClient = useQueryClient()

    return useMutation<
        ApiResponse<Item>,
        ApiClientError,
        { id: number; payload: ItemPayload }
    >({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number
            payload: ItemPayload
        }) => {
            return await apiClient.put<Item>(`/items/${id}`, payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["items"] })
            toast.success(res.message || "Barang berhasil diperbarui")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal memperbarui barang")
            }
        },
    })
}

export function useDeleteBarang() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<null>, ApiClientError, number>({
        mutationFn: async (id: number) => {
            return await apiClient.delete<null>(`/items/${id}`)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["items"] })
            toast.success(res.message || "Barang berhasil dihapus")
        },
        onError: (error: ApiClientError) => {
            toast.error(error.message || "Gagal menghapus barang")
        },
    })
}
