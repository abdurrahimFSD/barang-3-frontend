"use client"

import * as React from "react"
import {
    isServer,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

interface ProvidersProps {
    children: React.ReactNode
}

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                refetchOnWindowFocus: true,
                retry: 1,
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (isServer) {
        return makeQueryClient()
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
}

export function Providers({ children }: ProvidersProps) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <NuqsAdapter>
                <ThemeProvider>
                    {children}
                    <Toaster
                        position="top-right"
                        richColors
                        duration={3000}
                        closeButton
                    />
                </ThemeProvider>
            </NuqsAdapter>
        </QueryClientProvider>
    )
}
