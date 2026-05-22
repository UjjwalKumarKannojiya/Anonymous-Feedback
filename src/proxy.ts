import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function proxy(request: NextRequest) {

    const token = await getToken({req: request})
    const url = request.nextUrl

    // If already logged in and VERIFIED, redirect home away from auth pages
    if (token && token.isVerified && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'
    )) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // If logged in but NOT VERIFIED, only allow access to /verify
    if (token && !token.isVerified && !url.pathname.startsWith('/verify')) {
        return NextResponse.redirect(new URL(`/verify/${token.username}`, request.url))
    }

    // Redirect to sign-in if not logged in and trying to access protected pages (dashboard)
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*',
    ],
}
