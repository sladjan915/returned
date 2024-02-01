import { TRPCReactProvider } from '~/trpc/react';
import { type PropsWithChildren } from 'react';
import { cookies } from 'next/headers';

export default async function ServerProviders({ children }: PropsWithChildren) {
    return (
        <TRPCReactProvider cookies={cookies().toString()}>
            {children}
        </TRPCReactProvider>
    );
}
