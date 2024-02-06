'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAlert } from '~/app/[lang]/_components/AlertProvider';
import HeaderBalancer from '~/app/[lang]/_components/HeaderBalancer';
import ReturnedHeader from '~/app/[lang]/_components/ReturnedHeader';
import { api } from '~/trpc/react';
import { getBaseUrl } from '~/trpc/shared';

export default function RegisterItemForm({ itemId }: { itemId: string }) {
    const router = useRouter();
    const alert = useAlert();

    const t = useTranslations('RegisterNewItemForm');

    const [tag, setTag] = useState('');

    const { mutate: registerItem, isLoading: isRegisteringItem } =
        api.item.registerItem.useMutation({
            onSuccess: () => {
                router.refresh();
                alert.showSuccessMessage(t('item-registered'));
            },
            onError: (error) =>
                alert.showErrorMessage(error.data!.localizedMessage)
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
                    <h1 className='text-2xl font-bold'>
                        {t('register-new-item')}
                    </h1>
                    <span>{t('register-new-item-description')}</span>
                </div>
                <div className='flex w-full flex-col gap-y-2'>
                    <input
                        className='input input-bordered w-full text-center text-sm'
                        type='text'
                        placeholder={t('tag')}
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
                        {t('register')}
                    </button>
                </div>
            </div>
            <HeaderBalancer />
        </main>
    );
}
