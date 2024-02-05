import { type getCountries } from '~/server/data/countries';

export type Country = Awaited<ReturnType<typeof getCountries>>[number];
