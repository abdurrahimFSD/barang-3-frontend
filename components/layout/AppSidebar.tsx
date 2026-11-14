"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ArrowLeftRight,
    Boxes,
    ClipboardCheck,
    FileSpreadsheet,
    LayoutDashboard,
    Package,
    ReceiptText,
    Ruler,
    Tags,
    Users,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useCurrentUser } from "@/hooks/useCurrentUser"

interface NavItem {
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
    adminOnly?: boolean
}

const mainNav: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Katalog Barang",
        url: "/barang",
        icon: Package,
    },
    {
        title: "Transaksi Mutasi",
        url: "/transaksi",
        icon: ArrowLeftRight,
    },
    {
        title: "Permintaan Barang",
        url: "/permintaan",
        icon: ClipboardCheck,
    },
]

const masterNav: NavItem[] = [
    {
        title: "Kategori",
        url: "/kategori",
        icon: Tags,
        adminOnly: true,
    },
    {
        title: "Satuan",
        url: "/satuan",
        icon: Ruler,
        adminOnly: true,
    },
    {
        title: "Pengguna",
        url: "/pengguna",
        icon: Users,
        adminOnly: true,
    },
]

const reportNav: NavItem[] = [
    {
        title: "Laporan Stok",
        url: "/laporan-stok",
        icon: Boxes,
        adminOnly: true,
    },
    {
        title: "Laporan Transaksi",
        url: "/laporan-transaksi",
        icon: ReceiptText,
        adminOnly: true,
    },
    {
        title: "Laporan Permintaan",
        url: "/laporan-permintaan",
        icon: FileSpreadsheet,
        adminOnly: true,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { user, isAdmin } = useCurrentUser()

    const isItemActive = (url: string) => {
        if (url === "/dashboard") {
            return pathname === "/dashboard"
        }
        return pathname === url || pathname.startsWith(`${url}/`)
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="border-b border-sidebar-border px-4 py-3 group-data-[collapsible=icon]:p-2">
                <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shadow-xs">
                        <Package className="size-4" />
                    </div>
                    <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        Inventory System
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Menu Utama */}
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNav.map((item) => {
                                const active = isItemActive(item.url)
                                return (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            isActive={active}
                                            tooltip={item.title}
                                            render={<Link href={item.url} />}
                                        >
                                            <item.icon className="size-4" />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Master Data (Admin Only) */}
                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Master Data</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {masterNav.map((item) => {
                                    const active = isItemActive(item.url)
                                    return (
                                        <SidebarMenuItem key={item.url}>
                                            <SidebarMenuButton
                                                isActive={active}
                                                tooltip={item.title}
                                                render={
                                                    <Link href={item.url} />
                                                }
                                            >
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {/* Laporan (Admin Only) */}
                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Laporan</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {reportNav.map((item) => {
                                    const active = isItemActive(item.url)
                                    return (
                                        <SidebarMenuItem key={item.url}>
                                            <SidebarMenuButton
                                                isActive={active}
                                                tooltip={item.title}
                                                render={
                                                    <Link href={item.url} />
                                                }
                                            >
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:p-1.5">
                <div className="flex items-center gap-2 overflow-hidden group-data-[collapsible=icon]:justify-center">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-accent font-mono text-xs text-sidebar-accent-foreground">
                        {user?.name?.slice(0, 1).toUpperCase() || "U"}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-xs font-medium text-sidebar-foreground">
                            {user?.name || "Memuat..."}
                        </span>
                        <span className="truncate text-[10px] text-muted-foreground">
                            {user?.email || ""}
                        </span>
                    </div>
                    <Badge
                        variant={isAdmin ? "default" : "secondary"}
                        className="px-1.5 py-0 text-[10px] group-data-[collapsible=icon]:hidden"
                    >
                        {isAdmin ? "Admin" : "Staff"}
                    </Badge>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
