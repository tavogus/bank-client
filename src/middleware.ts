import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token');
    const { pathname } = request.nextUrl;

    // Public paths that don't require authentication
    const publicPaths = ['/login', '/register', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    // Allow API requests and static files
    if (pathname.startsWith('/api') || 
        pathname.startsWith('/_next') || 
        pathname.includes('.')) {
        return NextResponse.next();
    }

    // Redirect authenticated users away from public paths
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}; 