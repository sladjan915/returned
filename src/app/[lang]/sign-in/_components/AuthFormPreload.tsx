import AuthForm from './AuthForm';
import { api } from '~/trpc/server';

export default async function AuthFormPreload() {
    const countriesPromise = api.misc.getCountries.query();
    const clientCountryPromise = api.misc.getClientCountry.query();

    const [countries, clientCountry] = await Promise.all([
        countriesPromise,
        clientCountryPromise
    ]);

    return <AuthForm countries={countries} clientCountry={clientCountry} />;
}
