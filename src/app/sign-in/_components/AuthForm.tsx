'use client';

import LoadingButton from '~/app/_components/LoadingButton';
import { type Country } from '~/types/country';
import DialCodeSelect from './DialCodeSelect';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { api } from '~/trpc/react';
import { cn } from '~/utils/cn';
import { useAlert } from '~/app/_components/AlertProvider';

export default function AuthForm({
    countries,
    clientCountry
}: {
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

    // ========== OTP CODE ==========
    const [otpCode, setOTPCode] = useState('');
    const [isOTPCodeSend, setOTPCodeSent] = useState(false);
    // ==============================

    // ========== INTERACTIONS ==========
    const { mutate: sendOTPCode, isLoading: isSendingOTPCode } =
        api.auth.sendOTPCode.useMutation({
            onSuccess: () => {
                setOTPCodeSent(true);
                alert.showInfoMessage('OTP code has been sent');
            },
            onError: (error) => alert.showErrorMessage(error.message)
        });

    const { mutate: verifyOTPCode, isLoading: isVerifyingOTPCode } =
        api.auth.verifyOTPCode.useMutation({
            onSuccess: () => {
                router.replace('/dashboard');
                alert.showSuccessMessage('Signed in successfully');
            },
            onError: (error) => alert.showErrorMessage(error.message)
        });

    const areInputsDisabled = useMemo(
        () => isSendingOTPCode || isVerifyingOTPCode,
        [isSendingOTPCode, isVerifyingOTPCode]
    );
    // ==================================

    return (
        <div className='flex h-full w-full max-w-xs flex-col items-center justify-center gap-y-10'>
            <div className='flex flex-col gap-y-2 text-center'>
                <h1 className='text-2xl font-bold'>Sign In</h1>
                <span>
                    Fill in the fields below to get access to your account.
                </span>
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
                        placeholder='Phone Number'
                        value={phoneNumber}
                        disabled={areInputsDisabled}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                {isOTPCodeSend && (
                    <div className='flex w-full flex-col'>
                        <span className='px-3 py-1 text-sm'>OTP Code</span>
                        <input
                            className='input input-bordered w-full text-center text-sm'
                            type='tel'
                            placeholder='XXXXXX'
                            value={otpCode}
                            disabled={areInputsDisabled}
                            maxLength={6}
                            onChange={(e) => setOTPCode(e.target.value)}
                        />
                    </div>
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
                    {isOTPCodeSend ? 'Resend' : 'Send'} OTP Code
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
                        Verify
                    </LoadingButton>
                )}
            </div>
        </div>
    );
}
