import AuthFormClient from './AuthFormClient';
import { api } from '~/trpc/server';

export default async function AuthForm() {
    const countriesPromise = api.misc.getCountries.query();
    const clientCountryPromise = api.misc.getClientCountry.query();

    const [countries, clientCountry] = await Promise.all([
        countriesPromise,
        clientCountryPromise
    ]);

    return (
        <AuthFormClient countries={countries} clientCountry={clientCountry} />
    );
}
