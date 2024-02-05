'use client';

import { useRouter } from 'next/navigation';
import { forwardRef } from 'react';
import { useAlert } from '~/app/_components/AlertProvider';
import { api } from '~/trpc/react';
import { type MyItem } from '~/types/item';

const Ref_UnregisterItemForm = forwardRef<
    HTMLDialogElement,
    { item: MyItem; onClose: () => void }
>(({ item, onClose: onClose }, ref) => {
    const router = useRouter();
    const alert = useAlert();

    const { mutate: unregisterItem, isLoading: isUnregisteringItem } =
        api.item.unregisterItem.useMutation({
            onSuccess: () => {
                router.replace('/dashboard');
                router.refresh();

                alert.showSuccessMessage('Item has been unregistered');
            },
            onError: (error) => alert.showErrorMessage(error.message),
            onSettled: () => onClose()
        });

    return (
        <dialog className='modal' ref={ref}>
            <div className='modal-box flex flex-col'>
                <h1 className='text-xl font-bold text-error'>
                    IRREVERSIBLE ACTION!
                </h1>
                <span className='py-2 text-lg'>
                    Unregistering an item is an irreversible action.
                    Unregistered item cannot be registered again.
                    <br />
                    <span className='text-error'>
                        Are you sure that you want to continue?
                    </span>
                </span>
                <div className='modal-action flex flex-row'>
                    <button
                        className='btn'
                        onClick={onClose}
                        disabled={isUnregisteringItem}
                    >
                        Cancel
                    </button>
                    <button
                        className='btn btn-error'
                        onClick={() => unregisterItem({ id: item.id })}
                        disabled={isUnregisteringItem}
                    >
                        Unregister
                    </button>
                </div>
            </div>
        </dialog>
    );
});

export default Ref_UnregisterItemForm;
