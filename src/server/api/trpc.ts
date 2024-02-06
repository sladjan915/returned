import 'server-only';

import { type SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { type Database } from '~/types/supabase';
import { type NonNull } from '~/types/non-null';
import { AppError } from '~/server/error';
import { type Locale } from '~/i18n';
import { translator } from '~/utils/i18n';

type TRPCContext = NonNull<Awaited<ReturnType<typeof createTRPCContext>>>;

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ ctx, shape, error }) {
        const t = translator(ctx?.locale ?? 'en', 'Error');

        const appError =
            error.cause instanceof AppError
                ? error.cause
                : new AppError('unknown-error');

        return {
            ...shape,
            data: {
                appError,
                localizedMessage: t(appError.errorCode)
            }
        };
    }
});

const isAuthenticated = t.middleware(({ ctx, next }) => {
    const user = ctx.session?.user;

    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({
        ctx: ctx as TRPCContext
    });
});

export const createTRPCContext = async ({
    supabase,
    headers,
    locale
}: {
    supabase: SupabaseClient<Database>;
    headers: Headers;
    locale: Locale;
}) => {
    const {
        data: { session }
    } = await supabase.auth.getSession();

    return {
        supabase,
        session,
        headers,
        locale
    };
};

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);

export const createTRPCRouter = t.router;
