import * as React from "react"
import { Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    title?: string
    description?: string
    icon?: React.ComponentType<{ className?: string }>
    className?: string
}

export function EmptyState({
    title = "Belum ada data",
    description = "Data belum tersedia atau tidak ditemukan berdasarkan filter pencarian.",
    icon: Icon = Inbox,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center px-4 py-12 text-center",
                className
            )}
        >
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Icon className="size-6" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
                {title}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                {description}
            </p>
        </div>
    )
}
