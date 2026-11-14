"use client"

import * as React from "react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { PermintaanFilter } from "./PermintaanFilter"
import { PermintaanTable } from "./PermintaanTable"
import { RejectModalDialog } from "./RejectModalDialog"
import { ApproveConfirmDialog } from "./ApproveConfirmDialog"

export function PermintaanListView() {
    const { isStaff } = useCurrentUser()

    return (
        <div className="w-full min-w-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Permintaan Barang
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Daftar dan status persetujuan permintaan barang
                        inventaris oleh Staff.
                    </p>
                </div>
                {isStaff && (
                    <Link
                        href="/permintaan/tambah"
                        className={cn(buttonVariants(), "shrink-0 gap-1.5")}
                    >
                        <span>Tambah Permintaan</span>
                    </Link>
                )}
            </div>

            <PermintaanFilter />
            <PermintaanTable />

            <RejectModalDialog />
            <ApproveConfirmDialog />
        </div>
    )
}
