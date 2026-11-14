import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

const BACKEND_BASE_URL = (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1"
).replace(/\/$/, "")

async function handleProxy(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params
    const subPath = path.join("/")
    const search = request.nextUrl.search
    const targetUrl = `${BACKEND_BASE_URL}/${subPath}${search}`

    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    const forwardHeaders: Record<string, string> = {
        Accept: request.headers.get("accept") || "application/json",
    }

    if (token) {
        forwardHeaders["Authorization"] = `Bearer ${token}`
    }

    const contentType = request.headers.get("content-type")
    if (contentType) {
        forwardHeaders["Content-Type"] = contentType
    }

    const fetchOptions: RequestInit = {
        method: request.method,
        headers: forwardHeaders,
    }

    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
        const bodyBuffer = await request.arrayBuffer()
        if (bodyBuffer.byteLength > 0) {
            fetchOptions.body = bodyBuffer
        }
    }

    try {
        const backendResponse = await fetch(targetUrl, fetchOptions)

        const responseHeaders = new Headers()
        const backendContentType = backendResponse.headers.get("content-type")
        if (backendContentType) {
            responseHeaders.set("Content-Type", backendContentType)
        }

        const disposition = backendResponse.headers.get("content-disposition")
        if (disposition) {
            responseHeaders.set("Content-Disposition", disposition)
        }

        const response = new NextResponse(backendResponse.body, {
            status: backendResponse.status,
            statusText: backendResponse.statusText,
            headers: responseHeaders,
        })

        if (backendResponse.status === 401) {
            response.cookies.delete("auth_token")
            response.cookies.delete("user_role")
        }

        return response
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Tidak dapat terhubung ke server backend",
            },
            { status: 502 }
        )
    }
}

export const GET = handleProxy
export const POST = handleProxy
export const PUT = handleProxy
export const PATCH = handleProxy
export const DELETE = handleProxy
