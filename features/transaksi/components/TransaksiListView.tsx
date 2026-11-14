"use client"

import * as React from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TransaksiFilter } from "./TransaksiFilter"
import { TransaksiTable } from "./TransaksiTable"

export function TransaksiListView() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Transaksi Mutasi
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Log pergerakan barang masuk dan keluar secara sistematis.
                    </p>
                </div>
                <Link
                    href="/transaksi/tambah"
                    className={cn(buttonVariants(), "shrink-0")}
                >
                    <span>Tambah Transaksi</span>
                </Link>
            </div>

            <TransaksiFilter />
            <TransaksiTable />
        </div>
    )
}
