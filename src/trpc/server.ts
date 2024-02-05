import 'server-only';

import {
    createTRPCProxyClient,
    loggerLink,
    TRPCClientError
} from '@trpc/client';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { appRouter, type AppRouter } from '~/server/api/root';
import { type TRPCErrorResponse } from '@trpc/server/rpc';
import { createTRPCContext } from '~/server/api/trpc';
import { observable } from '@trpc/server/observable';
import { type Database } from '~/types/supabase';
import { callProcedure } from '@trpc/server';
import { cookies } from 'next/headers';
import { transformer } from './shared';
import { cache } from 'react';

const createServerTRPCContext = cache(() => {
    // OPTIMIZATION: Reduce number of calls of cookies() function.
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({
        cookies: () => cookieStore
    });

    return createTRPCContext({
        supabase: supabase,
        headers: new Headers({
            'cookie': cookies().toString(),
            'x-trpc-source': 'rsc'
        })
    });
});

export const api = createTRPCProxyClient<AppRouter>({
    transformer,
    links: [
        loggerLink({
            enabled: (op) =>
                process.env.NODE_ENV === 'development' ||
                (op.direction === 'down' && op.result instanceof Error)
        }),
        () =>
            ({ op }) =>
                observable((observer) => {
                    createServerTRPCContext()
                        .then((ctx) => {
                            return callProcedure({
                                procedures: appRouter._def.procedures,
                                path: op.path,
                                rawInput: op.input,
                                ctx: ctx,
                                type: op.type
                            });
                        })
                        .then((data) => {
                            observer.next({ result: { data } });
                            observer.complete();
                        })
                        .catch((cause: TRPCErrorResponse) => {
                            observer.error(TRPCClientError.from(cause));
                        });
                })
    ]
});
