import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "")

export async function POST() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (token) {
        try {
            await fetch(`${BACKEND_API_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            })
        } catch {
            // Lanjutkan pembersihan cookie lokal meskipun backend unreach
        }
    }

    const response = NextResponse.json({
        success: true,
        message: "Logout berhasil",
    })

    response.cookies.delete("auth_token")
    response.cookies.delete("user_role")

    return response
}
