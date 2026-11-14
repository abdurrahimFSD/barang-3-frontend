import type { UseFormSetError, FieldValues, Path } from "react-hook-form"
import type { ApiResponse, ApiErrorResponse } from "@/types/api"

function getBaseUrl(): string {
    if (typeof window !== "undefined") {
        return "/api/v1"
    }
    return (
        process.env.INTERNAL_API_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000/api/v1"
    ).replace(/\/$/, "")
}

export class ApiClientError extends Error {
    statusCode: number
    errors?: Record<string, string[]>

    constructor(
        message: string,
        statusCode: number,
        errors?: Record<string, string[]>
    ) {
        super(message)
        this.name = "ApiClientError"
        this.statusCode = statusCode
        this.errors = errors
    }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
    body?: unknown
    params?: Record<
        string,
        string | number | boolean | undefined | null | Array<string | number>
    >
    token?: string
}

async function request<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<ApiResponse<T>> {
    const { body, params, headers, token, ...restOptions } = options

    const baseUrl = getBaseUrl()
    let path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    if (baseUrl === "/api/v1" && path.startsWith("/api/v1")) {
        path = path.slice("/api/v1".length)
    }

    let url = endpoint.startsWith("http")
        ? endpoint
        : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`

    if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                if (Array.isArray(value)) {
                    value.forEach((v) =>
                        searchParams.append(`${key}[]`, String(v))
                    )
                } else {
                    searchParams.append(key, String(value))
                }
            }
        })
        const queryString = searchParams.toString()
        if (queryString) {
            url += `${url.includes("?") ? "&" : "?"}${queryString}`
        }
    }

    const requestHeaders: Record<string, string> = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string>),
    }

    let payload: BodyInit | undefined = undefined
    if (body !== undefined) {
        if (body instanceof FormData) {
            payload = body
        } else {
            requestHeaders["Content-Type"] = "application/json"
            payload = JSON.stringify(body)
        }
    }

    const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
        body: payload,
        credentials: "include",
    })

    const contentType = response.headers.get("content-type")
    const isJson = contentType && contentType.includes("application/json")
    const data = isJson ? await response.json() : null

    if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
            if (!window.location.pathname.startsWith("/login")) {
                const target = window.location.pathname + window.location.search
                window.location.replace(
                    `/login?from=${encodeURIComponent(target)}`
                )
            }
        }

        const errorData = (data as ApiErrorResponse) || null
        const message =
            errorData?.message ||
            `Request failed with status ${response.status}`

        throw new ApiClientError(message, response.status, errorData?.errors)
    }

    return (data ?? {
        success: true,
        message: "",
        data: null as unknown as T,
    }) as ApiResponse<T>
}

export const apiClient = {
    get<T>(endpoint: string, options?: Omit<RequestOptions, "body">) {
        return request<T>(endpoint, { ...options, method: "GET" })
    },
    post<T>(
        endpoint: string,
        body?: unknown,
        options?: Omit<RequestOptions, "body">
    ) {
        return request<T>(endpoint, { ...options, method: "POST", body })
    },
    put<T>(
        endpoint: string,
        body?: unknown,
        options?: Omit<RequestOptions, "body">
    ) {
        return request<T>(endpoint, { ...options, method: "PUT", body })
    },
    patch<T>(
        endpoint: string,
        body?: unknown,
        options?: Omit<RequestOptions, "body">
    ) {
        return request<T>(endpoint, { ...options, method: "PATCH", body })
    },
    delete<T>(endpoint: string, options?: Omit<RequestOptions, "body">) {
        return request<T>(endpoint, { ...options, method: "DELETE" })
    },
}

export function mapServerErrorsToForm<T extends FieldValues>(
    errors: Record<string, string[]>,
    setError: UseFormSetError<T>
) {
    Object.entries(errors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
            setError(field as Path<T>, {
                type: "server",
                message: messages[0],
            })
        }
    })
}
