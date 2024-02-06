import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { cn } from '~/utils/cn';

export default function ReturnedHeader({ className }: { className?: string }) {
    const t = useTranslations('ReturnedHeader');

    return (
        <Link className={cn('h-40', className)} href='/'>
            <div className='flex h-full w-full flex-col items-center justify-center'>
                <h1 className='text-5xl font-bold'>returned</h1>
                <h2 className='text-md'>{t('slogan')}</h2>
            </div>
        </Link>
    );
}
