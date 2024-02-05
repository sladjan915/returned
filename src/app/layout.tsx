import { Montserrat_Alternates } from 'next/font/google';
import Providers from '~/app/_components/Providers';
import { type PropsWithChildren } from 'react';
import { cn } from '~/utils/cn';
import '~/styles/globals.css';

const MontserratAlternates = Montserrat_Alternates({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin']
});

export const metadata = {
    title: 'returned',
    description: 'No more lost things!',
    icons: [{ rel: 'icon', url: '/icon.svg' }]
};

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang='en'>
            <body
                className={cn(
                    MontserratAlternates.className,
                    'relative flex h-dvh w-dvw items-center justify-center'
                )}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
