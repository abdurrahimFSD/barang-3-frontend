import { NextResponse } from "next/server"

const BACKEND_API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "")

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Email atau password tidak sesuai",
                    errors: data.errors,
                },
                { status: response.status }
            )
        }

        const nextResponse = NextResponse.json({
            success: true,
            message: data.message || "Login berhasil",
            data: {
                user: data.data.user,
            },
        })

        // HTTP-only cookie untuk otentikasi Sanctum (XSS Safe)
        nextResponse.cookies.set("auth_token", data.data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 jam
            path: "/",
        })

        // Cookie role untuk client-side layout filtering
        nextResponse.cookies.set("user_role", data.data.user.role, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            path: "/",
        })

        return nextResponse
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
