'use client';

import LoadingButton from '~/components/LoadingButton';
import { type Country } from '~/types/country';
import DialCodeSelect from './DialCodeSelect';
import { useRef, useState } from 'react';
import { api } from '~/trpc/react';
import { cn } from '~/utils/cn';

export default function AuthFormClient({
    countries,
    clientCountry
}: {
    countries: Country[];
    clientCountry: Country;
}) {
    const [selectedCountry, setSelectedCountry] = useState(clientCountry);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOTPCode] = useState('');

    const otpCodeRef = useRef();

    const [isOTPCodeSend, setOTPCodeSent] = useState(false);

    const { mutate: sendOTPCode, isLoading: isSendingOTPCode } =
        api.auth.sendOTPCode.useMutation({
            onSuccess: () => setOTPCodeSent(true)
        });

    const { mutate: verifyOTPCode, isLoading: isVerifyingOTPCode } =
        api.auth.verifyOTPCode.useMutation();

    return (
        <div className='max-w-sm w-full flex flex-col gap-y-10'>
            <div className='w-full flex flex-col gap-y-6'>
                <div className='w-full flex flex-row gap-x-2'>
                    <DialCodeSelect
                        countries={countries}
                        selectedCountry={selectedCountry}
                        onSelect={(country) => setSelectedCountry(country)}
                    />
                    <input
                        className='input input-bordered w-full text-sm'
                        placeholder='Phone Number'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type='tel'
                    />
                </div>
                {isOTPCodeSend && (
                    <div className='w-full flex flex-col'>
                        <span className='text-sm px-3 py-1'>OTP Code</span>
                        <input
                            className='input input-bordered w-full text-sm text-center'
                            placeholder='XXXXXX'
                            value={otpCode}
                            onChange={(e) => setOTPCode(e.target.value)}
                            type='tel'
                            maxLength={6}
                        />
                    </div>
                )}
            </div>
            <div className='flex flex-row w-full gap-x-2'>
                <LoadingButton
                    className={cn('flex-1', {
                        'btn-outline': isOTPCodeSend
                    })}
                    isLoading={isSendingOTPCode}
                    onClick={() =>
                        sendOTPCode({
                            phoneNumber: `${selectedCountry.dialCode}${phoneNumber}`
                        })
                    }
                    disabled={phoneNumber.length === 0}
                >
                    {isOTPCodeSend ? 'Resend' : 'Send'} OTP Code
                </LoadingButton>
                {isOTPCodeSend && (
                    <LoadingButton
                        className='flex-1'
                        isLoading={isVerifyingOTPCode}
                        onClick={() =>
                            verifyOTPCode({
                                phoneNumber,
                                otpCode
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
