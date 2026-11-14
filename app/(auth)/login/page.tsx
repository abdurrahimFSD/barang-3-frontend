import type { Metadata } from "next"
import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata: Metadata = {
    title: "Sign in",
    description: "Masuk ke Sistem Manajemen Inventaris Barang",
}

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </main>
    )
}
