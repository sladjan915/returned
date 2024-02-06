import moment from 'moment';
import { useTranslations } from 'next-intl';
import { type MyItem } from '~/types/item';
import { cn } from '~/utils/cn';

export default function Item({ item }: { item: MyItem }) {
    const t = useTranslations('Item');

    return (
        <div
            className={cn(
                'border-1 flex w-full flex-row items-center justify-between gap-x-4 rounded-xl bg-base-200 px-10 py-6',
                item.status === 'found' && 'border border-warning'
            )}
        >
            <span className='line-clamp-1 text-lg font-bold'>{item.tag}</span>
            <span className='min-w-fit text-center'>
                <span>{t('registered-at')}</span>
                <br />
                <span className='text-accent'>
                    {moment(item.registeredAt).format('DD MMM YYYY')}
                </span>
            </span>
        </div>
    );
}
