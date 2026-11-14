import * as React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { AppHeader } from "@/components/layout/AppHeader"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex min-h-screen min-w-0 flex-col">
                <AppHeader />
                <main className="flex-1 min-w-0 w-full bg-slate-50/50 p-4 md:p-6 dark:bg-slate-950/50">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
