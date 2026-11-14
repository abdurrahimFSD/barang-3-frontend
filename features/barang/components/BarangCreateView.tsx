"use client"

import * as React from "react"
import { PackagePlus } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BarangForm } from "./BarangForm"

export function BarangCreateView() {
    return (
        <div className="w-full space-y-6">
            <Card className="w-full border-border shadow-xs">
                <CardHeader className="border-b border-border/60 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <PackagePlus className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">
                                Tambah Barang Baru
                            </CardTitle>
                            <CardDescription className="mt-0.5 text-xs">
                                Daftarkan item barang baru lengkap dengan
                                klasifikasi kategori, satuan, stok awal, dan
                                ambang batas minimum stok.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <BarangForm />
                </CardContent>
            </Card>
        </div>
    )
}
