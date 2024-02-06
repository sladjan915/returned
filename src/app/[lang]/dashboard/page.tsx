import SignOutButton from './_components/SignOutButton';
import { api } from '~/trpc/server';
import ItemSection from './_components/ItemSection';
import ReturnedHeader from '../_components/ReturnedHeader';
import HeaderBalancer from '../_components/HeaderBalancer';
import { serverTranslator } from '~/utils/i18n';

export default async function DashboardPage() {
    const t = serverTranslator('DashboardPage');

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
                    <ItemSection title={t('found-items')} items={foundItems} />
                )}
                {(foundItems.length === 0 || otherItems.length > 0) && (
                    <ItemSection title={t('items')} items={otherItems} />
                )}
                <SignOutButton className='mt-8 w-full md:hidden' />
            </div>
            <HeaderBalancer />
        </main>
    );
}
