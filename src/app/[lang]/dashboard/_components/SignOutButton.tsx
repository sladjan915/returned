'use client';

import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { IoExitOutline } from 'react-icons/io5';
import { cn } from '~/utils/cn';
import { useAlert } from '../../_components/AlertProvider';
import { useTranslations } from 'next-intl';

export default function SignOutButton({ className }: { className?: string }) {
    const router = useRouter();
    const alert = useAlert();

    const t = useTranslations('SignOutButton');

    const { mutate: signOut, isLoading: isSigningOut } =
        api.auth.signOut.useMutation({
            onSuccess: () => {
                router.replace('/sign-in');
                alert.showInfoMessage(t('signed-out'));
            },
            onError: (error) =>
                alert.showErrorMessage(error.data!.localizedMessage)
        });

    return (
        <button
            className={cn('btn btn-outline btn-error', className)}
            onClick={() => signOut()}
            disabled={isSigningOut}
        >
            <span>{t('sign-out')}</span>
            <IoExitOutline className='-mr-1 text-lg' />
        </button>
    );
}
