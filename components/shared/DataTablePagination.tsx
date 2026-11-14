"use client"

import * as React from "react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { PaginationMeta } from "@/types/api"

interface DataTablePaginationProps {
    meta?: PaginationMeta
    onPageChange: (page: number) => void
    isLoading?: boolean
}

export function DataTablePagination({
    meta,
    onPageChange,
    isLoading = false,
}: DataTablePaginationProps) {
    if (!meta || meta.total === 0) {
        return null
    }

    const { current_page, per_page, total, last_page } = meta
    const from = (current_page - 1) * per_page + 1
    const to = Math.min(current_page * per_page, total)

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = []
        if (last_page <= 5) {
            for (let i = 1; i <= last_page; i++) pages.push(i)
        } else {
            pages.push(1)
            if (current_page > 3) {
                pages.push("ellipsis")
            }
            const start = Math.max(2, current_page - 1)
            const end = Math.min(last_page - 1, current_page + 1)
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }
            if (current_page < last_page - 2) {
                pages.push("ellipsis")
            }
            pages.push(last_page)
        }
        return pages
    }

    return (
        <div className="flex flex-col items-center justify-between gap-4 px-2 py-3 text-xs text-muted-foreground sm:flex-row">
            <div>
                Menampilkan{" "}
                <span className="font-mono font-medium text-foreground tabular-nums">
                    {from}
                </span>{" "}
                -{" "}
                <span className="font-mono font-medium text-foreground tabular-nums">
                    {to}
                </span>{" "}
                dari{" "}
                <span className="font-mono font-medium text-foreground tabular-nums">
                    {total}
                </span>{" "}
                data
            </div>

            <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            text="Sebelumnya"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (current_page > 1 && !isLoading) {
                                    onPageChange(current_page - 1)
                                }
                            }}
                            className={
                                current_page <= 1 || isLoading
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {getPageNumbers().map((pageItem, idx) => {
                        if (pageItem === "ellipsis") {
                            return (
                                <PaginationItem key={`ellipsis-${idx}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )
                        }

                        const isCurrent = pageItem === current_page
                        return (
                            <PaginationItem key={`page-${pageItem}`}>
                                <PaginationLink
                                    href="#"
                                    isActive={isCurrent}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (!isCurrent && !isLoading) {
                                            onPageChange(pageItem)
                                        }
                                    }}
                                    className={
                                        isCurrent
                                            ? "font-mono font-semibold tabular-nums"
                                            : "cursor-pointer font-mono tabular-nums"
                                    }
                                >
                                    {pageItem}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })}

                    <PaginationItem>
                        <PaginationNext
                            text="Berikutnya"
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (current_page < last_page && !isLoading) {
                                    onPageChange(current_page + 1)
                                }
                            }}
                            className={
                                current_page >= last_page || isLoading
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
