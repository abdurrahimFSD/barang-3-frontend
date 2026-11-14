"use client"

import * as React from "react"
import { Bell, CheckCheck, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { NotificationItem } from "./NotificationItem"
import { useNotifications } from "../hooks/useNotifications"
import { useMarkAllAsRead } from "../hooks/useMarkAllAsRead"

interface NotificationListProps {
    onClose?: () => void
}

export function NotificationList({ onClose }: NotificationListProps) {
    const { data: response, isLoading } = useNotifications()
    const markAllMutation = useMarkAllAsRead()

    const notifications = response?.data || []
    const unreadCount = notifications.filter((n) => !n.is_read).length

    return (
        <div className="flex max-h-[420px] w-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/20 p-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                        Notifikasi
                    </span>
                    {unreadCount > 0 && (
                        <span className="rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary tabular-nums">
                            {unreadCount} baru
                        </span>
                    )}
                </div>

                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAllMutation.mutate()}
                        disabled={markAllMutation.isPending}
                        className="h-7 gap-1 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                        title="Tandai semua notifikasi telah dibaca"
                    >
                        {markAllMutation.isPending ? (
                            <Loader2 className="size-3 animate-spin" />
                        ) : (
                            <CheckCheck className="size-3" />
                        )}
                        <span>Tandai Semua Dibaca</span>
                    </Button>
                )}
            </div>

            {/* List Body */}
            <div className="flex-1 divide-y divide-border/40 overflow-y-auto">
                {isLoading ? (
                    <div className="space-y-3 p-3">
                        <div className="flex items-start gap-3">
                            <Skeleton className="size-7 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-3 w-3/4" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-2.5 w-1/4" />
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Skeleton className="size-7 shrink-0 rounded-full" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-3 w-2/3" />
                                <Skeleton className="h-3 w-5/6" />
                                <Skeleton className="h-2.5 w-1/4" />
                            </div>
                        </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="space-y-2 px-4 py-10 text-center">
                        <div className="mx-auto flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Bell className="size-4" />
                        </div>
                        <p className="text-xs font-medium text-foreground">
                            Belum ada notifikasi
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Pemberitahuan persetujuan dan aktivitas stok akan
                            muncul di sini.
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onSelect={onClose}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
