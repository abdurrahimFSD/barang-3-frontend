"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { LogOut, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export function UserNav() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { user, isLoading } = useCurrentUser()
    const [isLoggingOut, setIsLoggingOut] = React.useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            })
            queryClient.clear()
            toast.success("Berhasil keluar")
            router.push("/login")
            router.refresh()
        } catch {
            toast.error("Gagal melakukan logout")
        } finally {
            setIsLoggingOut(false)
        }
    }

    if (isLoading) {
        return <div className="size-8 animate-pulse rounded-full bg-muted" />
    }

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant="ghost"
                        className="relative size-8 rounded-full p-0"
                    />
                }
            >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-semibold text-primary">
                    {initials}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1.5 p-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm leading-none font-semibold">
                                    {user?.name || "Pengguna"}
                                </p>
                                <Badge
                                    variant={
                                        user?.role === "admin"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="capitalize"
                                >
                                    {user?.role || "Staff"}
                                </Badge>
                            </div>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email || ""}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        disabled
                        className="text-xs text-muted-foreground"
                    >
                        <UserIcon className="mr-2 size-3.5" />
                        <span>
                            Role:{" "}
                            {user?.role === "admin"
                                ? "Administrator"
                                : "Staf Operasional"}
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="cursor-pointer"
                >
                    <LogOut className="mr-2 size-4" />
                    <span>{isLoggingOut ? "Keluar..." : "Log out"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
