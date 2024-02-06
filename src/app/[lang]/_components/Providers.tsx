import { TRPCReactProvider } from '~/trpc/react';
import AlertProvider from './AlertProvider';
import { type PropsWithChildren } from 'react';
import { cookies } from 'next/headers';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export default function Providers({ children }: PropsWithChildren) {
    return (
        <AlertProvider>
            <NextIntlClientProvider messages={useMessages()}>
                <TRPCReactProvider cookies={cookies().toString()}>
                    {children}
                </TRPCReactProvider>
            </NextIntlClientProvider>
        </AlertProvider>
    );
}
