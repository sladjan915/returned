'use client';

import LoadingButton from '~/app/[lang]/_components/LoadingButton';
import { type Country } from '~/types/country';
import DialCodeSelect from './DialCodeSelect';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { api } from '~/trpc/react';
import { cn } from '~/utils/cn';
import { useAlert } from '~/app/[lang]/_components/AlertProvider';
import { useTranslations } from 'next-intl';

export default function AuthForm({
    countries,
    clientCountry
}: {
    countries: Country[];
    clientCountry: Country;
}) {
    const router = useRouter();
    const alert = useAlert();

    const t = useTranslations('AuthForm');

    // ========== PHONE NUMBER ==========
    const [selectedCountry, setSelectedCountry] = useState(clientCountry);
    const [phoneNumber, setPhoneNumber] = useState('');

    const fullPhoneNumber = useMemo(
        () => `${selectedCountry.dialCode}${phoneNumber}`,
        [selectedCountry, phoneNumber]
    );
    // ==================================

    // ========== OTP CODE ==========
    const [otpCode, setOTPCode] = useState('');
    const [isOTPCodeSend, setOTPCodeSent] = useState(false);
    // ==============================

    // ========== INTERACTIONS ==========
    const { mutate: sendOTPCode, isLoading: isSendingOTPCode } =
        api.auth.sendOTPCode.useMutation({
            onSuccess: () => {
                setOTPCodeSent(true);
                alert.showInfoMessage(t('otp-code-sent'));
            },
            onError: (error) =>
                alert.showErrorMessage(error.data!.localizedMessage)
        });

    const { mutate: verifyOTPCode, isLoading: isVerifyingOTPCode } =
        api.auth.verifyOTPCode.useMutation({
            onSuccess: () => {
                router.replace('/dashboard');
                alert.showSuccessMessage(t('signed-in-sucessfully'));
            },
            onError: (error) =>
                alert.showErrorMessage(error.data!.localizedMessage)
        });

    const areInputsDisabled = useMemo(
        () => isSendingOTPCode || isVerifyingOTPCode,
        [isSendingOTPCode, isVerifyingOTPCode]
    );
    // ==================================

    return (
        <div className='flex h-full w-full max-w-xs flex-col items-center justify-center gap-y-10'>
            <div className='flex flex-col gap-y-2 text-center'>
                <h1 className='text-2xl font-bold'>{t('sign-in')}</h1>
                <span>{t('sign-in-description')}</span>
            </div>
            <div className='flex w-full flex-col gap-y-6'>
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
                        placeholder={t('phone-number')}
                        value={phoneNumber}
                        disabled={areInputsDisabled}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                {isOTPCodeSend && (
                    <input
                        className='input input-bordered w-full text-center text-sm'
                        type='tel'
                        placeholder={t('otp-code')}
                        value={otpCode}
                        disabled={areInputsDisabled}
                        maxLength={6}
                        onChange={(e) => setOTPCode(e.target.value)}
                    />
                )}
            </div>
            <div className='flex w-full flex-row gap-x-2'>
                <LoadingButton
                    className={cn('flex-1', {
                        'btn-outline': isOTPCodeSend
                    })}
                    isLoading={isSendingOTPCode}
                    disabled={phoneNumber.length === 0 || areInputsDisabled}
                    onClick={() =>
                        sendOTPCode({
                            phoneNumber: fullPhoneNumber
                        })
                    }
                >
                    {isOTPCodeSend ? t('resend-otp-code') : t('send-otp-code')}
                </LoadingButton>
                {isOTPCodeSend && (
                    <LoadingButton
                        className='flex-1'
                        isLoading={isVerifyingOTPCode}
                        disabled={otpCode.length !== 6 || areInputsDisabled}
                        onClick={() =>
                            verifyOTPCode({
                                phoneNumber: fullPhoneNumber,
                                otpCode: otpCode
                            })
                        }
                    >
                        {t('verify')}
                    </LoadingButton>
                )}
            </div>
        </div>
    );
}
