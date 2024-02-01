import 'server-only';

import { getClientCountryCode } from './ip';
import { z } from 'zod';

export async function getCountries() {
    const response = await fetch('https://restcountries.com/v2/all', {
        next: { revalidate: 3600 * 24 }
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const object = await response.json();

    const CountrySchema = z
        .object({
            name: z.string(),
            alpha2Code: z.string(),
            callingCodes: z.array(z.string())
        })
        .transform(({ name, alpha2Code, callingCodes }) => ({
            name: name,
            code: alpha2Code,
            dialCode: `+${callingCodes[0]}`,
            flagUrl: `https://flagcdn.com/${alpha2Code.toLowerCase()}.svg`
        }));

    const countries = z.array(CountrySchema).parse(object);
    return countries;
}

export async function getClientCountry() {
    const countriesPromise = getCountries();
    const clientCountryCodePromise = getClientCountryCode();

    const [countries, clientCountryCode] = await Promise.all([
        countriesPromise,
        clientCountryCodePromise
    ]);

    return countries.find((country) => country.code === clientCountryCode)!;
}
