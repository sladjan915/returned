import { Montserrat_Alternates } from 'next/font/google';
import Providers from '~/app/[lang]/_components/Providers';
import { type PropsWithChildren } from 'react';
import { cn } from '~/utils/cn';
import '~/styles/globals.css';
import { type Locale } from '~/i18n';

const MontserratAlternates = Montserrat_Alternates({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin']
});

export const metadata = {
    title: 'returned',
    description: 'No more lost things!',
    icons: [{ rel: 'icon', url: '/icon.svg' }]
};

export default function RootLayout({
    children,
    params: { lang }
}: PropsWithChildren<{ params: { lang: Locale } }>) {
    return (
        <html lang={lang}>
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
