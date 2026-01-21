import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_key_change_me"
)

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Define protected routes
    const isDashboardRoute = pathname.startsWith('/dashboard')
    const isApiProtected =
        (pathname.startsWith('/api/products') && ['POST', 'PUT', 'DELETE'].includes(request.method)) ||
        (pathname.startsWith('/api/orders') && request.method === 'GET') ||
        pathname.startsWith('/api/admin/settings')

    if (isDashboardRoute || isApiProtected) {
        const token = request.cookies.get('admin_token')?.value

        if (!token) {
            console.warn(`Middleware: No token found for protected path ${pathname}`);
            if (isDashboardRoute) {
                const url = new URL('/login', request.url);
                return NextResponse.redirect(url);
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        try {
            await jwtVerify(token, JWT_SECRET)
            return NextResponse.next()
        } catch (e: any) {
            console.error(`Middleware: JWT Verification failed for ${pathname}:`, e.message);
            if (isDashboardRoute) {
                const url = new URL('/login', request.url);
                return NextResponse.redirect(url);
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard',
        '/dashboard/:path*',
        '/api/products/:path*',
        '/api/orders/:path*',
        '/api/admin/:path*',
    ],
}
