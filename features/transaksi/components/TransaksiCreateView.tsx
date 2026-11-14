"use client"

import * as React from "react"
import { ArrowLeftRight } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TransaksiForm } from "./TransaksiForm"

export function TransaksiCreateView() {
    return (
        <div className="w-full space-y-6">
            <Card className="w-full border-border shadow-xs">
                <CardHeader className="border-b border-border/60 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ArrowLeftRight className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">
                                Catat Transaksi Mutasi
                            </CardTitle>
                            <CardDescription className="mt-0.5 text-xs">
                                Catat aktivitas penambahan stok barang masuk atau
                                pengeluaran barang inventaris. Mutasi ini bersifat
                                permanen dan tidak dapat diubah atau dihapus.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <TransaksiForm />
                </CardContent>
            </Card>
        </div>
    )
}

