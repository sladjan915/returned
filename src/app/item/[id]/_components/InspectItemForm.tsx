'use client';

import moment from 'moment';
import Image from 'next/image';
import {
    HeaderBalancer,
    ReturnedHeader
} from '~/app/_components/ReturnedHeader';
import { getBaseUrl } from '~/trpc/shared';
import Ref_UnregisterItemForm from './UnregisterItemForm';
import { useRef } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { useAlert } from '~/app/_components/AlertProvider';
import { type MyItem } from '~/types/item';

export default function InspectItemForm({ item }: { item: MyItem }) {
    const router = useRouter();
    const alert = useAlert();

    const unregisterFormRef = useRef<HTMLDialogElement>(null);

    const { mutate: markAsReturned, isLoading: isMarkingAsReturned } =
        api.item.markAsReturned.useMutation({
            onSuccess: () => {
                router.refresh();
                alert.showInfoMessage('Marked as returned');
            },
            onError: (error) => alert.showErrorMessage(error.message)
        });

    return (
        <main className='flex h-full w-full max-w-xs flex-col items-center'>
            <ReturnedHeader />
            <div className='flex w-full flex-1 flex-col items-center justify-center gap-y-12'>
                <Image
                    className='h-auto w-52'
                    src={`https://quickchart.io/qr?text=${getBaseUrl()}\/item\/${item.id}&light=1d232a&dark=ffffff&size=512&margin=0`}
                    alt={item.id}
                    width={512}
                    height={512}
                    priority
                />
                <div className='text-md flex w-full flex-col'>
                    <span className='flex w-full flex-row justify-between'>
                        <span>Tag:</span>
                        <span className='font-bold text-accent'>
                            {item.tag}
                        </span>
                    </span>
                    <span className='flex w-full flex-row justify-between'>
                        <span>Registered at:</span>
                        <span className='font-bold text-accent'>
                            {moment(item.registeredAt).format('DD MMM YYYY')}
                        </span>
                    </span>
                </div>
                <div className='flex w-full flex-col gap-y-4'>
                    {item.status === 'found' && (
                        <button
                            className='btn btn-warning w-full'
                            onClick={() => markAsReturned({ itemId: item.id })}
                            disabled={isMarkingAsReturned}
                        >
                            Mark as returned
                        </button>
                    )}
                    <button
                        className='btn btn-outline btn-error w-full'
                        onClick={() => unregisterFormRef.current?.showModal()}
                        disabled={isMarkingAsReturned}
                    >
                        Unregister
                    </button>
                    <Ref_UnregisterItemForm
                        item={item}
                        onClose={() => unregisterFormRef.current?.close()}
                        ref={unregisterFormRef}
                    />
                </div>
            </div>
            <HeaderBalancer />
        </main>
    );
}
