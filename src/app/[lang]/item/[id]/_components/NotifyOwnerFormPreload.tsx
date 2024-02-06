import { api } from '~/trpc/server';
import NotifyOwnerForm from './NotifyOwnerForm';
import { type RegisteredItem } from '~/types/item';

export default async function NotifyOwnerFormPreload({
    item
}: {
    item: RegisteredItem;
}) {
    const countriesPromise = api.misc.getCountries.query();
    const clientCountryPromise = api.misc.getClientCountry.query();

    const [countries, clientCountry] = await Promise.all([
        countriesPromise,
        clientCountryPromise
    ]);

    return (
        <NotifyOwnerForm
            item={item}
            countries={countries}
            clientCountry={clientCountry}
        />
    );
}
