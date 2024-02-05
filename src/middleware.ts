import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    matcher: ['/', '/sign-in', '/dashboard']
};

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({ req, res });
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (
        !user &&
        req.nextUrl.pathname !== '/' &&
        req.nextUrl.pathname !== '/sign-in'
    ) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    if (user && req.nextUrl.pathname === '/')
        return NextResponse.redirect(new URL('/dashboard', req.url));

    if (user && req.nextUrl.pathname === '/sign-in') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
}
