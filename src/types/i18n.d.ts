import { type messages } from '~/i18n';

declare module '../../node_modules/use-intl/dist/types/src/react/useTranslations' {
    type IntlMessages = (typeof messages)['en'];
}

declare module '../../node_modules/next-intl/dist/types/src/server/react-server/getTranslations' {
    type IntlMessages = (typeof messages)['en'];
}

declare module '../../node_modules/use-intl/dist/types/src/core/createTranslator' {
    type IntlMessages = (typeof messages)['en'];
}
