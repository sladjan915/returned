import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createTRPCContext } from '~/server/api/trpc';
import { type Database } from '~/types/supabase';
import { appRouter } from '~/server/api/root';
import { cookies } from 'next/headers';
import { env } from '~/env';
import { type Locale } from '~/i18n';

const createRouteTRPCContext = async (req: NextRequest) => {
    // OPTIMIZATION: Reduce number of calls of cookies() function.
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
        cookies: () => cookieStore
    });

    const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'en';

    return createTRPCContext({
        supabase: supabase,
        headers: req.headers,
        locale: locale as Locale
    });
};

const handler = (req: NextRequest) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req: req,
        router: appRouter,
        createContext: () => createRouteTRPCContext(req),
        onError:
            env.NODE_ENV === 'development'
                ? ({ path, error }) => {
                      console.error(
                          `❌ tRPC failed on ${path ?? '<no-path>'}: ${
                              error.message
                          }`
                      );
                  }
                : undefined
    });

export { handler as GET, handler as POST };
