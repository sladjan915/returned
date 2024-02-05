import { TRPCReactProvider } from '~/trpc/react';
import { AlertProvider } from './AlertProvider';
import { type PropsWithChildren } from 'react';
import { cookies } from 'next/headers';

export default function Providers({ children }: PropsWithChildren) {
    return (
        <AlertProvider>
            <TRPCReactProvider cookies={cookies().toString()}>
                {children}
            </TRPCReactProvider>
        </AlertProvider>
    );
}
