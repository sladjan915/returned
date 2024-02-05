import Link from 'next/link';
import { cn } from '~/utils/cn';

export function ReturnedHeader({ className }: { className?: string }) {
    return (
        <Link className={cn('h-40', className)} href='/'>
            <div className='flex h-full w-full flex-col items-center justify-center'>
                <h1 className='text-5xl font-bold'>returned</h1>
                <h2 className='text-md'>No more lost things!</h2>
            </div>
        </Link>
    );
}

export function HeaderBalancer() {
    return <div className='h-24' />;
}
