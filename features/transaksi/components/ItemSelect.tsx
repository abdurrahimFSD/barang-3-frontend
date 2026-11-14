"use client"

import * as React from "react"
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxCollection,
    ComboboxItem,
    ComboboxEmpty,
} from "@/components/ui/combobox"
import { useBarangList } from "@/features/barang/hooks/useBarangList"
import type { Item } from "@/types/barang"

interface ItemSelectProps {
    value: number
    onChange: (itemId: number, item?: Item) => void
    disabled?: boolean
    ariaInvalid?: boolean
}

export function ItemSelect({
    value,
    onChange,
    disabled,
    ariaInvalid,
}: ItemSelectProps) {
    const { data: response, isLoading } = useBarangList({ perPage: 100 })
    const items = React.useMemo(() => response?.data || [], [response?.data])

    const selectedItem = React.useMemo(
        () => items.find((it) => it.id === value) ?? null,
        [items, value]
    )

    const handleValueChange = (item: Item | null) => {
        onChange(item?.id ?? 0, item ?? undefined)
    }

    return (
        <div className="space-y-1.5">
            <Combobox
                items={items}
                value={selectedItem}
                onValueChange={handleValueChange}
                disabled={disabled || isLoading}
                itemToStringLabel={(item: Item | null) =>
                    item ? `${item.name} (${item.code})` : ""
                }
                isItemEqualToValue={(item: Item, val: Item | null) =>
                    val ? item.id === val.id : false
                }
                filter={(item: Item, query: string) => {
                    const q = query.toLowerCase().trim()
                    if (!q) return true
                    return (
                        item.name.toLowerCase().includes(q) ||
                        item.code.toLowerCase().includes(q)
                    )
                }}
            >
                <ComboboxInput
                    id="transaction-item"
                    placeholder={
                        isLoading
                            ? "Memuat data barang..."
                            : "Cari atau pilih barang inventaris..."
                    }
                    className="w-full"
                    aria-invalid={ariaInvalid}
                    showClear
                />
                <ComboboxContent align="start" className="w-[--anchor-width]">
                    <ComboboxList>
                        <ComboboxEmpty className="py-4 text-center text-sm text-muted-foreground">
                            Barang tidak ditemukan.
                        </ComboboxEmpty>
                        <ComboboxCollection>
                            {(item: Item) => (
                                <ComboboxItem
                                    key={item.id}
                                    value={item}
                                    className="flex items-center justify-between py-2"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">
                                            {item.name}{" "}
                                            <span className="font-mono text-xs text-muted-foreground">
                                                ({item.code})
                                            </span>
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            Stok: {item.stock}{" "}
                                            {item.unit?.abbreviation ||
                                                item.unit?.name ||
                                                ""}
                                        </span>
                                    </div>
                                </ComboboxItem>
                            )}
                        </ComboboxCollection>
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>

            {selectedItem && (
                <p className="text-xs text-muted-foreground">
                    Sisa stok saat ini:{" "}
                    <span className="font-mono font-semibold text-foreground tabular-nums">
                        {selectedItem.stock}
                    </span>{" "}
                    {selectedItem.unit?.abbreviation ||
                        selectedItem.unit?.name ||
                        ""}
                </p>
            )}
        </div>
    )
}
