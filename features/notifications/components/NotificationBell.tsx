"use client"

import * as React from "react"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { NotificationList } from "./NotificationList"
import { useUnreadCount } from "../hooks/useUnreadCount"

export function NotificationBell() {
    const [open, setOpen] = React.useState(false)
    const { data: response } = useUnreadCount()

    const unreadCount = response?.data?.unread_count || 0
    const displayCount = unreadCount > 99 ? "99+" : unreadCount

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative size-8"
                        aria-label="Buka notifikasi"
                        title={
                            unreadCount > 0
                                ? `${unreadCount} notifikasi baru`
                                : "Notifikasi"
                        }
                    >
                        <Bell className="size-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 animate-in items-center justify-center rounded-full bg-destructive px-0.5 font-mono text-[9px] font-bold tabular-nums text-white ring-1 ring-background zoom-in-75">
                                {displayCount}
                            </span>
                        )}
                    </Button>
                }
            />
            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-80 overflow-hidden rounded-xl border-border p-0 shadow-lg sm:w-96"
            >
                <NotificationList onClose={() => setOpen(false)} />
            </PopoverContent>
        </Popover>
    )
}
