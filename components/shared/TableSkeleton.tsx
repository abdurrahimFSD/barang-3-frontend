import * as React from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
    columnsCount: number
    rowsCount?: number
}

export function TableSkeleton({
    columnsCount,
    rowsCount = 5,
}: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rowsCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                    {Array.from({ length: columnsCount }).map((_, colIndex) => (
                        <TableCell
                            key={`skeleton-cell-${rowIndex}-${colIndex}`}
                        >
                            <Skeleton className="h-5 w-full max-w-[200px]" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )
}
