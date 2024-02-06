'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAlert } from '~/app/[lang]/_components/AlertProvider';
import HeaderBalancer from '~/app/[lang]/_components/HeaderBalancer';
import ReturnedHeader from '~/app/[lang]/_components/ReturnedHeader';
import DialCodeSelect from '~/app/[lang]/sign-in/_components/DialCodeSelect';
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

    const t = useTranslations('NotifyOwnerForm');

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
                alert.showSuccessMessage(t('owner-notified'));
            },
            onError: (error) =>
                alert.showErrorMessage(error.data!.localizedMessage)
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
                    <h1 className='text-2xl font-bold'>{t('you-found-it')}</h1>
                    <span>{t('your-found-it-description')}</span>
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
                            ? t('notify-owner')
                            : t('owner-already-notified')}
                    </button>
                </div>
            </div>
            <HeaderBalancer />
        </main>
    );
}
