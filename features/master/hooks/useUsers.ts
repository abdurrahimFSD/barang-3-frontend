import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { apiClient, ApiClientError } from "@/lib/api-client"
import type { ApiResponse } from "@/types/api"
import type { User, CreateUserPayload, UpdateUserPayload } from "@/types/auth"

interface UseUsersParams {
    search?: string
    page?: number
    perPage?: number
    all?: boolean
    enabled?: boolean
}

export function useUsers({
    search = "",
    page = 1,
    perPage = 10,
    all = false,
    enabled = true,
}: UseUsersParams = {}) {
    return useQuery({
        queryKey: ["users", { search, page, perPage, all }],
        queryFn: async () => {
            const response = await apiClient.get<User[]>("/users", {
                params: {
                    search: search || undefined,
                    page,
                    per_page: perPage,
                    all: all ? true : undefined,
                },
            })
            return response
        },
        enabled,
        staleTime: 60 * 1000,
        placeholderData: keepPreviousData,
    })
}

export function useCreateUser() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<User>, ApiClientError, CreateUserPayload>({
        mutationFn: async (payload: CreateUserPayload) => {
            return await apiClient.post<User>("/users", payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success(res.message || "Pengguna berhasil ditambahkan")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal menambahkan pengguna")
            }
        },
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient()

    return useMutation<
        ApiResponse<User>,
        ApiClientError,
        {
            id: number
            payload: UpdateUserPayload
        }
    >({
        mutationFn: async ({
            id,
            payload,
        }: {
            id: number
            payload: UpdateUserPayload
        }) => {
            return await apiClient.put<User>(`/users/${id}`, payload)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success(res.message || "Pengguna berhasil diperbarui")
        },
        onError: (error: ApiClientError) => {
            if (error.statusCode !== 422) {
                toast.error(error.message || "Gagal memperbarui pengguna")
            }
        },
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<null>, ApiClientError, number>({
        mutationFn: async (id: number) => {
            return await apiClient.delete<null>(`/users/${id}`)
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success(res.message || "Pengguna berhasil dihapus")
        },
        onError: (error: ApiClientError) => {
            toast.error(error.message || "Gagal menghapus pengguna")
        },
    })
}
