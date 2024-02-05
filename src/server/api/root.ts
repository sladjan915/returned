import { createTRPCRouter } from '~/server/api/trpc';
import { miscRouter } from './routers/misc';
import { authRouter } from './routers/auth';
import { itemRouter } from './routers/item';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    item: itemRouter,
    misc: miscRouter
});

export type AppRouter = typeof appRouter;
