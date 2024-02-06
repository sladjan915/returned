import { type MyItem } from '~/types/item';
import Item from './Item';
import Link from 'next/link';
import { getBaseUrl } from '~/trpc/shared';
import { useTranslations } from 'next-intl';

export default function ItemSection({
    title,
    items
}: {
    title: string;
    items: MyItem[];
}) {
    const t = useTranslations('ItemSection');

    return (
        <div className='relative flex min-h-24 w-full flex-col gap-y-3 rounded-2xl border border-neutral p-4'>
            <span className='pointer-events-none absolute -top-3.5 left-6 h-min bg-base-100 px-3 text-xl'>
                {title}
            </span>
            {items.map((item) => (
                <Link
                    className='w-full transition-all hover:scale-[102%]'
                    href={`${getBaseUrl()}/item/${item.id}`}
                    key={item.id}
                >
                    <Item item={item} key={item.id} />
                </Link>
            ))}
            {items.length === 0 && (
                <span className='flex px-5 py-4 text-lg text-accent'>
                    {t('empty')}
                </span>
            )}
        </div>
    );
}
