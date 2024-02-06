'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { forwardRef } from 'react';
import { useAlert } from '~/app/[lang]/_components/AlertProvider';
import { api } from '~/trpc/react';
import { type MyItem } from '~/types/item';

const Ref_UnregisterItemForm = forwardRef<
    HTMLDialogElement,
    { item: MyItem; onClose: () => void }
>(({ item, onClose: onClose }, ref) => {
    const router = useRouter();
    const alert = useAlert();

    const t = useTranslations('UnregisterNewItemForm');

    const { mutate: unregisterItem, isLoading: isUnregisteringItem } =
        api.item.unregisterItem.useMutation({
            onSuccess: () => {
                router.replace('/dashboard');
                router.refresh();

                alert.showSuccessMessage(t('item-unregistered'));
            },
            onError: (error) =>
                alert.showErrorMessage(error.data!.localizedMessage),
            onSettled: () => onClose()
        });

    return (
        <dialog className='modal' ref={ref}>
            <div className='modal-box flex flex-col'>
                <h1 className='text-xl font-bold text-error'>
                    {t('irreversible-action')}
                </h1>
                <span className='py-2 text-lg'>
                    <span>{t('irreversible-action-description')}</span>
                    <br />
                    <span className='text-error'>{t('are-you-sure')}</span>
                </span>
                <div className='modal-action flex flex-row'>
                    <button
                        className='btn'
                        onClick={onClose}
                        disabled={isUnregisteringItem}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        className='btn btn-error'
                        onClick={() => unregisterItem({ id: item.id })}
                        disabled={isUnregisteringItem}
                    >
                        {t('unregister')}
                    </button>
                </div>
            </div>
        </dialog>
    );
});

export default Ref_UnregisterItemForm;
