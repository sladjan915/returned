import { notFound } from 'next/navigation';
import { api } from '~/trpc/server';
import RegisterItemForm from './_components/RegisterItemForm';
import { ensureAuthenticated } from '~/utils/unauthenticated';
import InspectItemForm from './_components/InspectItemForm';
import NotifyOwnerFormPreload from './_components/NotifyOwnerFormPreload';

export default async function Item({
    params: { id }
}: {
    params: { id: string };
}) {
    const item = await api.item.getItem.query({ id });

    if (item.status === 'non-existent') notFound();

    if (item.status === 'non-registered') {
        await ensureAuthenticated();
        return <RegisterItemForm itemId={id} />;
    }

    return 'ownerId' in item ? (
        <InspectItemForm item={item} />
    ) : (
        <NotifyOwnerFormPreload item={item} />
    );
}
