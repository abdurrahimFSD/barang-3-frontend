import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: {
        template: "%s | Inventory Management System",
        default: "Inventory Management System",
    },
    description: "Sistem Manajemen Inventaris Barang dan Mutasi Stok",
}

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
})

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="id"
            suppressHydrationWarning
            className={cn(
                "antialiased",
                geistSans.variable,
                geistMono.variable,
                "font-sans"
            )}
        >
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
