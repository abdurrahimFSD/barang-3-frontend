"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, FileText, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"

import { useMarkAsRead } from "../hooks/useMarkAsRead"
import type { AppNotification, NotificationType } from "@/types/notification"

interface NotificationItemProps {
    notification: AppNotification
    onSelect?: () => void
}

function getNotificationIcon(type: NotificationType) {
    switch (type) {
        case "request_approved":
            return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                </div>
            )
        case "request_rejected":
            return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                    <XCircle className="size-4" />
                </div>
            )
        case "low_stock":
            return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-4" />
                </div>
            )
        case "request_submitted":
        default:
            return (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <FileText className="size-4" />
                </div>
            )
    }
}

export function NotificationItem({
    notification,
    onSelect,
}: NotificationItemProps) {
    const router = useRouter()
    const markAsReadMutation = useMarkAsRead()

    const timeAgo = React.useMemo(() => {
        try {
            return formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: idLocale,
            })
        } catch {
            return "-"
        }
    }, [notification.created_at])

    const handleClick = () => {
        if (!notification.is_read) {
            markAsReadMutation.mutate(notification.id)
        }

        if (notification.data?.item_request_id) {
            router.push(`/permintaan/${notification.data.item_request_id}`)
            onSelect?.()
        } else if (notification.data?.item_id) {
            router.push(`/barang/${notification.data.item_id}`)
            onSelect?.()
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`flex w-full items-start gap-3 border-b border-border/50 p-3 text-left transition-colors last:border-b-0 hover:bg-muted/50 ${
                !notification.is_read ? "bg-primary/5 dark:bg-primary/10" : ""
            }`}
        >
            {getNotificationIcon(notification.type)}

            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <p
                        className={`truncate text-xs ${
                            !notification.is_read
                                ? "font-semibold text-foreground"
                                : "font-medium text-muted-foreground"
                        }`}
                    >
                        {notification.title}
                    </p>
                    {!notification.is_read && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                    )}
                </div>

                <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                    {notification.message}
                </p>

                <p className="font-mono text-[10px] text-muted-foreground/75">
                    {timeAgo}
                </p>
            </div>
        </button>
    )
}
