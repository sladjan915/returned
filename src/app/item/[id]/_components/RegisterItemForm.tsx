'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAlert } from '~/app/_components/AlertProvider';
import {
    ReturnedHeader,
    HeaderBalancer
} from '~/app/_components/ReturnedHeader';
import { api } from '~/trpc/react';
import { getBaseUrl } from '~/trpc/shared';

export default function RegisterItemForm({ itemId }: { itemId: string }) {
    const router = useRouter();
    const alert = useAlert();

    const [tag, setTag] = useState('');

    const { mutate: registerItem, isLoading: isRegisteringItem } =
        api.item.registerItem.useMutation({
            onSuccess: () => {
                router.refresh();
                alert.showSuccessMessage('Item has been registered');
            },
            onError: (error) => alert.showErrorMessage(error.message)
        });

    return (
        <main className='flex h-full max-w-xs flex-col items-center'>
            <ReturnedHeader />
            <div className='flex flex-1 flex-col items-center justify-center gap-y-8'>
                <Image
                    className='h-auto w-52'
                    src={`https://quickchart.io/qr?text=${getBaseUrl()}\/item\/${itemId}&light=1d232a&dark=ffffff&size=512&margin=0`}
                    alt={itemId}
                    width={512}
                    height={512}
                    priority
                />
                <div className='flex flex-col gap-y-2 text-center'>
                    <h1 className='text-2xl font-bold'>Register New Item</h1>
                    <span>
                        Fill in the data to proceed with the registration.
                    </span>
                </div>
                <div className='flex w-full flex-col gap-y-2'>
                    <input
                        className='input input-bordered w-full text-center text-sm'
                        type='text'
                        placeholder='Tag'
                        value={tag}
                        disabled={isRegisteringItem}
                        onChange={(e) => setTag(e.target.value)}
                    />
                    <button
                        className='btn btn-success w-full'
                        onClick={() =>
                            registerItem({
                                id: itemId,
                                tag: tag
                            })
                        }
                        disabled={isRegisteringItem}
                    >
                        Register
                    </button>
                </div>
            </div>
            <HeaderBalancer />
        </main>
    );
}
