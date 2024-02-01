import 'server-only';

import { headers } from 'next/headers';
import { env } from '~/env';
import { z } from 'zod';

export function getClientIP() {
    return headers()?.get('x-forwarded-for')?.split(',').at(0);
}

export async function getClientCountryCode() {
    const ip = getClientIP();
    const response = await fetch(
        `https://ipinfo.io/${process.env.VERCEL_URL ? ip : ''}?token=${
            env.IPINFO_API_KEY
        }`
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object = await response.json();

    const IpInfoSchema = z.object({
        country: z.string()
    });

    const ipInfo = IpInfoSchema.parse(object);
    const countryCode = ipInfo.country;

    return countryCode;
}
