"use client"

import * as React from "react"
import Link from "next/link"
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle2,
    FileText,
    Package,
    UserCheck,
    User as UserIcon,
    XCircle,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { formatDateTime } from "@/lib/formatters"
import { PermintaanStatusBadge } from "./PermintaanStatusBadge"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useModalStore } from "@/stores/useModalStore"
import type { ItemRequest } from "@/types/permintaan"

interface PermintaanDetailCardProps {
    request?: ItemRequest
    isLoading: boolean
}

export function PermintaanDetailCard({
    request,
    isLoading,
}: PermintaanDetailCardProps) {
    const { isAdmin } = useCurrentUser()
    const { openModal } = useModalStore()

    if (isLoading) {
        return (
            <Card className="border-border shadow-xs">
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="mt-2 h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!request) {
        return (
            <Card className="border-border shadow-xs">
                <CardContent className="py-12 text-center text-muted-foreground">
                    Data pengajuan permintaan tidak ditemukan atau telah
                    dihapus.
                </CardContent>
            </Card>
        )
    }

    const unitAbbr =
        request.item?.unit?.abbreviation || request.item?.unit?.name || ""
    const isPending = request.status === "pending"

    return (
        <div className="space-y-6">
            <Card className="border-border shadow-xs">
                <CardHeader className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/permintaan"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "icon" })
                            )}
                            title="Kembali ke Permintaan"
                        >
                            <ArrowLeft className="size-4" />
                        </Link>

                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="font-mono text-xl font-bold">
                                    {request.request_code}
                                </CardTitle>
                                <PermintaanStatusBadge status={request.status} />
                            </div>
                            <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                                <Calendar className="size-3.5" />
                                Diajukan pada {formatDateTime(request.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Admin Action Bar on Pending Requests */}
                    {isAdmin && isPending && (
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    openModal("rejectItemRequest", request)
                                }
                                className="h-9 gap-1.5 border-rose-500/30 text-xs text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:hover:bg-rose-500/20"
                            >
                                <XCircle className="size-4" />
                                <span>Tolak Permintaan</span>
                            </Button>
                            <Button
                                size="sm"
                                onClick={() =>
                                    openModal("approveItemRequest", request)
                                }
                                className="h-9 gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                            >
                                <CheckCircle2 className="size-4" />
                                <span>Setujui Permintaan</span>
                            </Button>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    {/* Alasan Penolakan Alert Box (khusus rejected) */}
                    {request.status === "rejected" &&
                        request.rejection_reason && (
                            <div className="space-y-1.5 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                                    <AlertCircle className="size-4.5 shrink-0" />
                                    <span>Alasan Penolakan Pengajuan</span>
                                </div>
                                <p className="pl-6.5 text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
                                    {request.rejection_reason}
                                </p>
                            </div>
                        )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Informasi Pemohon */}
                        <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
                            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                <UserIcon className="size-4 text-primary" />
                                <span>Pemohon Permintaan</span>
                            </div>
                            <div className="space-y-1 text-xs">
                                <div className="font-medium text-foreground">
                                    {request.user?.name || "Staff"}
                                </div>
                                <div className="font-mono text-muted-foreground">
                                    {request.user?.email || "-"}
                                </div>
                            </div>
                        </div>

                        {/* Informasi Barang & Jumlah */}
                        <div className="space-y-3 rounded-xl border border-border/80 bg-muted/20 p-4">
                            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                <Package className="size-4 text-primary" />
                                <span>Barang yang Diajukan</span>
                            </div>
                            <div className="space-y-1 text-xs">
                                <div className="font-medium text-foreground">
                                    {request.item?.name || "-"}
                                </div>
                                <div className="font-mono text-muted-foreground">
                                    KODE: {request.item?.code || "-"}
                                </div>
                                <div className="pt-1 font-mono font-semibold text-foreground">
                                    Jumlah: {request.quantity} {unitAbbr}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Keperluan */}
                    <div className="space-y-1.5 rounded-xl border border-border/80 bg-muted/10 p-4 text-xs">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                            <FileText className="size-4 text-primary" />
                            <span>Keperluan / Alasan Permintaan</span>
                        </div>
                        <div className="pl-6 leading-relaxed whitespace-pre-wrap text-muted-foreground">
                            {request.purpose}
                        </div>
                    </div>

                    {/* Informasi Persetujuan / Peninjau (jika sudah ditindaklanjuti) */}
                    {Boolean(request.approved_at) && (
                        <div className="space-y-1.5 rounded-xl border border-border/80 bg-muted/10 p-4 text-xs">
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                                <UserCheck className="size-4 text-primary" />
                                <span>Informasi Peninjauan Admin</span>
                            </div>
                            <div className="pl-6 text-muted-foreground">
                                Ditinjau oleh:{" "}
                                <span className="font-medium text-foreground">
                                    {request.approver?.name || "Admin"}
                                </span>{" "}
                                pada {formatDateTime(request.approved_at)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
