import 'server-only';

import {
    createRouteHandlerClient,
    Session
} from '@supabase/auth-helpers-nextjs';
import { initTRPC, TRPCError } from '@trpc/server';
import { cookies } from 'next/headers';
import superjson from 'superjson';
import { ZodError } from 'zod';

export const createTRPCContext = async (opts: { headers: Headers }) => {
    const supabase = createRouteHandlerClient({ cookies });
    const session = await supabase.auth.getSession();

    return {
        session: session.data.session,
        ...opts
    };
};

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

const authBypassMiddleware = t.middleware(({ ctx, next }) => {
    const user = ctx.session?.user;

    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({
        ctx: ctx as {
            headers: Headers;
            session: Session;
        }
    });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authBypassMiddleware);

export const createTRPCRouter = t.router;
