"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DataTableColumnHeaderProps
    extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    sortKey: string
    activeSortBy?: string
    activeSortOrder?: "asc" | "desc"
    onSort: (column: string) => void
    align?: "left" | "center" | "right"
}

export function DataTableColumnHeader({
    title,
    sortKey,
    activeSortBy,
    activeSortOrder,
    onSort,
    align = "left",
    className,
}: DataTableColumnHeaderProps) {
    const isSorted = activeSortBy === sortKey

    return (
        <div
            className={cn(
                "flex items-center gap-1",
                align === "center" && "justify-center",
                align === "right" && "justify-end",
                className
            )}
        >
            <Button
                variant="ghost"
                size="xs"
                onClick={() => onSort(sortKey)}
                className={cn(
                    "-ml-2 h-7 px-2 font-medium text-muted-foreground transition-colors hover:text-foreground",
                    isSorted && "font-semibold text-foreground",
                    align === "right" && "-mr-2 ml-0"
                )}
            >
                <span>{title}</span>
                {isSorted && activeSortOrder === "desc" ? (
                    <ArrowDown className="size-3.5 text-foreground" />
                ) : isSorted && activeSortOrder === "asc" ? (
                    <ArrowUp className="size-3.5 text-foreground" />
                ) : (
                    <ArrowUpDown className="size-3.5 opacity-50 group-hover:opacity-100" />
                )}
            </Button>
        </div>
    )
}

