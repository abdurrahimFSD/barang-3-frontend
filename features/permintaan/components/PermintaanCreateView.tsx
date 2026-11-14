"use client"

import * as React from "react"
import { ClipboardList } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { PermintaanForm } from "./PermintaanForm"

export function PermintaanCreateView() {
    return (
        <div className="w-full space-y-6">
            <Card className="w-full border-border shadow-xs">
                <CardHeader className="border-b border-border/60 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ClipboardList className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">
                                Ajukan Permintaan Barang
                            </CardTitle>
                            <CardDescription className="mt-0.5 text-xs">
                                Kirimkan permohonan pengambilan barang inventaris untuk
                                keperluan operasional. Permintaan akan ditinjau oleh
                                Administrator.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <PermintaanForm />
                </CardContent>
            </Card>
        </div>
    )
}
