import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import en from './messages/en.json';
import sr from './messages/sr.json';

export const messages = {
    en,
    sr
};

export type Locale = keyof typeof messages;

export default getRequestConfig(async ({ locale }) => {
    if (!(locale in messages)) notFound();

    return {
        messages: messages[locale as Locale]
    };
});
