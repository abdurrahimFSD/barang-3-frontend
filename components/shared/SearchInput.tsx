"use client"

import * as React from "react"
import { useQueryState, parseAsInteger } from "nuqs"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchInputProps extends Omit<
    React.ComponentProps<"input">,
    "value" | "onChange"
> {
    searchKey?: string
    pageKey?: string | null
    debounceMs?: number
    containerClassName?: string
}

export function SearchInput({
    searchKey = "search",
    pageKey = "page",
    debounceMs = 300,
    placeholder = "Cari...",
    containerClassName,
    className,
    ...props
}: SearchInputProps) {
    const [searchQuery, setSearchQuery] = useQueryState(searchKey, {
        defaultValue: "",
    })
    const [, setPage] = useQueryState(
        pageKey ?? "page",
        parseAsInteger.withDefault(1)
    )

    const [inputVal, setInputVal] = React.useState(searchQuery)

    // Sync input saat searchQuery di URL berubah dari luar (misal: navigasi / back button)
    React.useEffect(() => {
        setInputVal(searchQuery)
    }, [searchQuery])

    // Debounce update ke URL saat inputVal diketik oleh user
    React.useEffect(() => {
        if (inputVal === searchQuery) return

        const timer = setTimeout(() => {
            setSearchQuery(inputVal || null)
            if (pageKey) {
                setPage(1)
            }
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [inputVal, searchQuery, debounceMs, setSearchQuery, pageKey, setPage])

    const handleClear = () => {
        setInputVal("")
        setSearchQuery(null)
        if (pageKey) {
            setPage(1)
        }
    }

    return (
        <div className={cn("relative max-w-sm flex-1", containerClassName)}>
            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={placeholder}
                className={cn("h-9 pr-9 pl-9", className)}
                {...props}
            />
            {inputVal && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-1/2 right-2.5 z-10 -translate-y-1/2 cursor-pointer rounded-xs p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Hapus pencarian"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    )
}
