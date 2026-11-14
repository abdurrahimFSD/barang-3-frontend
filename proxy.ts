import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_ONLY_ROUTES = [
    "/pengguna",
    "/kategori",
    "/satuan",
    "/laporan",
    "/laporan-stok",
    "/laporan-transaksi",
    "/laporan-permintaan",
]

const STAFF_ONLY_ROUTES = ["/permintaan/tambah"]

export function proxy(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value
    const role = request.cookies.get("user_role")?.value
    const { pathname } = request.nextUrl

    const isAuthRoute = pathname === "/login" || pathname.startsWith("/login/")
    const isApiAuthRoute = pathname.startsWith("/api/auth")
    const isApiRoute = pathname.startsWith("/api/")

    // Bypass API auth route handler
    if (isApiAuthRoute) {
        return NextResponse.next()
    }

    // Unauthenticated API request -> return JSON 401
    if (!token && isApiRoute) {
        return NextResponse.json(
            { success: false, message: "Unauthenticated" },
            { status: 401 }
        )
    }

    // Unauthenticated user attempting to access protected pages
    if (!token && !isAuthRoute) {
        const loginUrl = new URL("/login", request.url)
        if (pathname !== "/") {
            loginUrl.searchParams.set("from", pathname)
        }
        return NextResponse.redirect(loginUrl)
    }

    // Authenticated user attempting to access login page
    if (token && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // RBAC: Staff attempting to access Admin-only master data & reports
    if (token && role === "staff") {
        const isRestricted = ADMIN_ONLY_ROUTES.some(
            (route) => pathname === route || pathname.startsWith(`${route}/`)
        )
        if (isRestricted) {
            return NextResponse.redirect(new URL("/dashboard", request.url))
        }
    }

    // RBAC: Admin attempting to access Staff-only request submission
    if (token && role === "admin") {
        const isStaffOnly = STAFF_ONLY_ROUTES.some(
            (route) => pathname === route || pathname.startsWith(`${route}/`)
        )
        if (isStaffOnly) {
            return NextResponse.redirect(new URL("/permintaan", request.url))
        }
    }

    return NextResponse.next()
}

export default proxy

export const config = {
    matcher: [
        /*
         * Match all application routes except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, images, icons
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
