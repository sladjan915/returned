import 'server-only';

import { type SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { type Database } from '~/types/supabase';
import { type NonNull } from '~/types/non-null';

type TRPCContext = NonNull<Awaited<ReturnType<typeof createTRPCContext>>>;

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null
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
    headers
}: {
    supabase: SupabaseClient<Database>;
    headers: Headers;
}) => {
    const {
        data: { session }
    } = await supabase.auth.getSession();

    return {
        supabase,
        session,
        headers
    };
};

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);

export const createTRPCRouter = t.router;
