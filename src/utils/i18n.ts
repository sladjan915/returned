import {
    type NamespaceKeys,
    type NestedKeyOf,
    createTranslator
} from 'next-intl';
import { type IntlMessages } from 'node_modules/next-intl/dist/types/src/server/react-server/getTranslations';
import { cookies } from 'next/headers';
import { messages, type Locale } from '~/i18n';

export function translator<
    NestedKey extends NamespaceKeys<
        IntlMessages,
        NestedKeyOf<IntlMessages>
    > = never
>(locale: Locale, namespace?: NestedKey) {
    return createTranslator({
        locale,
        namespace,
        messages: messages[locale]
    });
}

export function serverTranslator<
    NestedKey extends NamespaceKeys<
        IntlMessages,
        NestedKeyOf<IntlMessages>
    > = never
>(namespace?: NestedKey) {
    const cookieStore = cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'en';

    return translator(locale as Locale, namespace);
}
