import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

const create_i18n_Response = createIntlMiddleware({
    locales: ['en', 'sr'],
    defaultLocale: 'en',
    pathnames: {
        '/': '/',
        '/dashboard': {
            en: '/dashboard',
            sr: '/komandna-tabla'
        },
        '/sign-in': {
            en: '/sign-in',
            sr: '/prijava'
        },
        '/item/[itemId]': {
            en: '/item/[itemId]',
            sr: '/oznaka/[itemId]'
        }
    }
});

export async function middleware(req: NextRequest) {
    const [, locale, ...segments] = req.nextUrl.pathname.split('/');
    const savedLocale = req.cookies.get('NEXT_LOCALE')?.value;

    const pathnameWithoutLocale = `/${segments.join('/')}`;

    // Necessery in order for `Set-Cookie` header to take effect.
    const res = create_i18n_Response(req);
    if (!locale || locale !== savedLocale) return res;

    const supabase = createMiddlewareClient({ req, res });
    const {
        data: { user }
    } = await supabase.auth.getUser();

    const signInPathname = { en: '/sign-in', sr: '/prijava' }[locale]!;
    const dashboardPathname = { en: '/dashboard', sr: '/komandna-tabla' }[
        locale
    ]!;

    console.log(req.nextUrl);

    if (!user && pathnameWithoutLocale === dashboardPathname) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    }

    if (user && pathnameWithoutLocale === signInPathname) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return res;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
