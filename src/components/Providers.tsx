import ServerProviders from './ServerProviders';
import ClientProviders from './ClientProviders';
import { type PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
    return (
        <ServerProviders>
            <ClientProviders>{children}</ClientProviders>
        </ServerProviders>
    );
}
