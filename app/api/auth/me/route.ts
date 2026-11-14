import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "")

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Unauthenticated" },
            { status: 401 }
        )
    }

    try {
        const response = await fetch(`${BACKEND_API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })

        const data = await response.json()

        if (!response.ok) {
            const nextRes = NextResponse.json(
                {
                    success: false,
                    message: data.message || "Sesi telah berakhir",
                },
                { status: response.status }
            )
            if (response.status === 401) {
                nextRes.cookies.delete("auth_token")
                nextRes.cookies.delete("user_role")
            }
            return nextRes
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Tidak dapat terhubung ke server backend",
            },
            { status: 500 }
        )
    }
}
