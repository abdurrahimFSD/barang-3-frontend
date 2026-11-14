import { useQuery } from "@tanstack/react-query"
import type { ApiResponse } from "@/types/api"
import type { User } from "@/types/auth"

async function fetchCurrentUser(): Promise<User | null> {
    try {
        const response = await fetch("/api/auth/me", {
            headers: {
                Accept: "application/json",
            },
        })

        if (!response.ok) {
            return null
        }

        const json: ApiResponse<User> = await response.json()
        return json.data || null
    } catch {
        return null
    }
}

export function useCurrentUser() {
    const {
        data: user,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["auth", "me"],
        queryFn: fetchCurrentUser,
        staleTime: 5 * 60 * 1000,
        retry: false,
    })

    return {
        user,
        isLoading,
        error,
        isAdmin: user?.role === "admin",
        isStaff: user?.role === "staff",
        refetch,
    }
}
