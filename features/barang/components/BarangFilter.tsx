"use client"

import * as React from "react"
import { useQueryState, parseAsInteger } from "nuqs"

import { SearchInput } from "@/components/shared/SearchInput"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/features/master/hooks/useCategories"

export function BarangFilter() {
    const [categoryId, setCategoryId] = useQueryState("category_id", {
        defaultValue: "",
    })
    const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

    const { data: categoryData } = useCategories({ all: true })
    const categories = categoryData?.data || []

    const categoryItems = React.useMemo(
        () => [
            { value: "all", label: "Semua Kategori" },
            ...categories.map((cat) => ({
                value: String(cat.id),
                label: cat.name,
            })),
        ],
        [categories]
    )

    const handleCategoryChange = (val: string | null) => {
        setCategoryId(val === "all" || !val ? null : val)
        setPage(1)
    }

    return (
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <SearchInput placeholder="Cari kode atau nama barang..." />

            <div className="w-full sm:w-56">
                <Select
                    items={categoryItems}
                    value={categoryId || "all"}
                    onValueChange={handleCategoryChange}
                >
                    <SelectTrigger className="h-9 w-full">
                        <SelectValue>
                            {categoryItems.find((i) => i.value === (categoryId || "all"))?.label ?? "Semua Kategori"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {categoryItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
