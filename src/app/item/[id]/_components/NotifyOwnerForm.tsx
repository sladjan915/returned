'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAlert } from '~/app/_components/AlertProvider';
import {
    ReturnedHeader,
    HeaderBalancer
} from '~/app/_components/ReturnedHeader';
import DialCodeSelect from '~/app/sign-in/_components/DialCodeSelect';
import { api } from '~/trpc/react';
import { type Country } from '~/types/country';
import { type RegisteredItem } from '~/types/item';

export default function NotifyOwnerForm({
    item,
    countries,
    clientCountry
}: {
    item: RegisteredItem;
    countries: Country[];
    clientCountry: Country;
}) {
    const router = useRouter();
    const alert = useAlert();

    // ========== PHONE NUMBER ==========
    const [selectedCountry, setSelectedCountry] = useState(clientCountry);
    const [phoneNumber, setPhoneNumber] = useState('');

    const fullPhoneNumber = useMemo(
        () => `${selectedCountry.dialCode}${phoneNumber}`,
        [selectedCountry, phoneNumber]
    );
    // ==================================

    const { mutate: notifyOwner, isLoading: isNotifyingOwner } =
        api.item.notifyOwner.useMutation({
            onSuccess: () => {
                router.refresh();
                alert.showSuccessMessage(
                    'The owner has been notified! Thank you!'
                );
            },
            onError: (error) => alert.showErrorMessage(error.message)
        });

    const areInputsDisabled = useMemo(
        () => isNotifyingOwner || item.status === 'found',
        [isNotifyingOwner, item]
    );

    return (
        <main className='flex h-full max-w-xs flex-col items-center'>
            <ReturnedHeader />
            <div className='flex flex-1 flex-col items-center justify-center gap-y-8'>
                <div className='flex flex-col gap-y-2 text-center'>
                    <h1 className='text-2xl font-bold'>You found it!</h1>
                    <span>
                        You found someone else's belonging! Please fill in the
                        fields below with your data so that we can notify the
                        owner that their stuff is safe with you!
                    </span>
                </div>
                <div className='flex w-full flex-col gap-y-8'>
                    <div className='flex w-full flex-row gap-x-2'>
                        <DialCodeSelect
                            countries={countries}
                            selectedCountry={selectedCountry}
                            disabled={areInputsDisabled}
                            onSelect={(country) => setSelectedCountry(country)}
                        />
                        <input
                            className='input input-bordered w-full text-sm'
                            type='tel'
                            placeholder='Phone Number'
                            value={phoneNumber}
                            disabled={areInputsDisabled}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <button
                        className='btn btn-success w-full'
                        onClick={() =>
                            notifyOwner({
                                itemId: item.id,
                                finderPhoneNumber: fullPhoneNumber
                            })
                        }
                        disabled={areInputsDisabled}
                    >
                        {item.status === 'registered'
                            ? 'Notify Owner'
                            : 'Owner Has Been Notified'}
                    </button>
                </div>
            </div>
            <HeaderBalancer />
        </main>
    );
}
