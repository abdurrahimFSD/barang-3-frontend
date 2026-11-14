"use client"

import * as React from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    React.useEffect(() => {
        // Log the error to an error reporting service if needed
        console.error("Dashboard error boundary:", error)
    }, [error])

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 p-6 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="size-6" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Terjadi Kesalahan pada Halaman
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {error.message ||
                    "Gagal memuat data tampilan. Silakan muat ulang atau coba beberapa saat lagi."}
            </p>
            <Button
                variant="outline"
                onClick={() => reset()}
                className="mt-4 gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
            >
                <RotateCcw className="size-4" />
                Coba Lagi
            </Button>
        </div>
    )
}
