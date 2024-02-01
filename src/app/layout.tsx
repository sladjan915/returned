import { Montserrat_Alternates } from 'next/font/google';
import Providers from '~/components/Providers';
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
            <body className={cn(MontserratAlternates.className)}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
