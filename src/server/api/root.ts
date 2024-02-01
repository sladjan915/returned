import { createTRPCRouter } from '~/server/api/trpc';
import { miscRouter } from './routers/misc';
import { authRouter } from './routers/auth';

export const appRouter = createTRPCRouter({
    auth: authRouter,
    misc: miscRouter
});

export type AppRouter = typeof appRouter;
