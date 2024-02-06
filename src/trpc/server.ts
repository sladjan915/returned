import 'server-only';

import { createTRPCProxyClient, TRPCClientError } from '@trpc/client';
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
import { type Locale } from '~/i18n';

const createServerTRPCContext = cache(() => {
    // OPTIMIZATION: Reduce number of calls of cookies() function.
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({
        cookies: () => cookieStore
    });

    const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'en';

    return createTRPCContext({
        supabase: supabase,
        headers: new Headers({
            'cookie': cookies().toString(),
            'x-trpc-source': 'rsc'
        }),
        locale: locale as Locale
    });
});

export const api = createTRPCProxyClient<AppRouter>({
    transformer,
    links: [
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
