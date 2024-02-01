import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (code) await supabase.auth.exchangeCodeForSession(code);

    return NextResponse.redirect(new URL('/account', req.url));
}
