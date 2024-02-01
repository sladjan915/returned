import { getClientCountry, getCountries } from '~/server/data/countries';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const miscRouter = createTRPCRouter({
    getCountries: publicProcedure.query(() => getCountries()),
    getClientCountry: publicProcedure.query(() => getClientCountry())
});
