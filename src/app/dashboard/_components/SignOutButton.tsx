'use client';

import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import { IoExitOutline } from 'react-icons/io5';
import { cn } from '~/utils/cn';
import { useAlert } from '~/app/_components/AlertProvider';

export default function SignOutButton({ className }: { className?: string }) {
    const router = useRouter();
    const alert = useAlert();

    const { mutate: signOut, isLoading: isSigningOut } =
        api.auth.signOut.useMutation({
            onSuccess: () => {
                router.replace('/sign-in');
                alert.showInfoMessage("You've been signed out");
            },
            onError: (error) => alert.showErrorMessage(error.message)
        });

    return (
        <button
            className={cn('btn btn-outline btn-error', className)}
            onClick={() => signOut()}
            disabled={isSigningOut}
        >
            <span>Sign Out</span>
            <IoExitOutline className='-mr-1 text-lg' />
        </button>
    );
}
