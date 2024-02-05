import SignOutButton from './_components/SignOutButton';
import { getBaseUrl } from '~/trpc/shared';
import Link from 'next/link';
import {
    ReturnedHeader,
    HeaderBalancer
} from '~/app/_components/ReturnedHeader';
import { api } from '~/trpc/server';
import moment from 'moment';
import Item from './_components/Item';
import ItemSection from './_components/ItemSection';

export default async function Dashboard() {
    const items = await api.item.getMyItems.query();

    const foundItems = items.filter((item) => item.status === 'found');
    const otherItems = items.filter((item) => item.status === 'registered');

    return (
        <main className='flex h-full w-full max-w-[1250px] flex-col items-center gap-y-8 px-6 min-[480px]:px-16'>
            <div className='flex w-full flex-row'>
                <div className='hidden flex-1 md:flex' />
                <ReturnedHeader className='w-min flex-1' />
                <div className='hidden flex-1 flex-shrink flex-row items-center justify-end md:flex'>
                    <SignOutButton />
                </div>
            </div>
            <div className='flex w-full flex-1 flex-col items-center gap-y-3'>
                {foundItems.length > 0 && (
                    <ItemSection title='Found Items' items={foundItems} />
                )}
                {(foundItems.length === 0 || otherItems.length > 0) && (
                    <ItemSection title='Items' items={otherItems} />
                )}
                <SignOutButton className='mt-8 w-full md:hidden' />
            </div>
            <HeaderBalancer />
        </main>
    );
}
