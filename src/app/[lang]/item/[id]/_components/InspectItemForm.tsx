'use client';

import moment from 'moment';
import Image from 'next/image';
import { getBaseUrl } from '~/trpc/shared';
import Ref_UnregisterItemForm from './UnregisterItemForm';
import { useRef } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation';
import { type MyItem } from '~/types/item';
import { useAlert } from '~/app/[lang]/_components/AlertProvider';
import { useTranslations } from 'next-intl';
import ReturnedHeader from '~/app/[lang]/_components/ReturnedHeader';
import HeaderBalancer from '~/app/[lang]/_components/HeaderBalancer';

export default function InspectItemForm({ item }: { item: MyItem }) {
    const router = useRouter();
    const alert = useAlert();

    const t = useTranslations('InspectItemForm');

    const unregisterFormRef = useRef<HTMLDialogElement>(null);

    const { mutate: markAsReturned, isLoading: isMarkingAsReturned } =
        api.item.markAsReturned.useMutation({
            onSuccess: () => {
                router.refresh();
                alert.showInfoMessage(t('marked-as-returned'));
            },
            onError: (error) =>
                alert.showErrorMessage(error.data!.localizedMessage)
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
                        <span>{t('tag')}:</span>
                        <span className='font-bold text-accent'>
                            {item.tag}
                        </span>
                    </span>
                    <span className='flex w-full flex-row justify-between'>
                        <span>{t('registered-at')}:</span>
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
                            {t('mark-as-returned')}
                        </button>
                    )}
                    <button
                        className='btn btn-outline btn-error w-full'
                        onClick={() => unregisterFormRef.current?.showModal()}
                        disabled={isMarkingAsReturned}
                    >
                        {t('unregister')}
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
