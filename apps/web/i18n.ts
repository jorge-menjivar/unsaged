import { getRequestConfig } from 'next-intl/server';
import { IntlErrorCode } from 'next-intl';

export default getRequestConfig(async ({ locale }) => ({
    getMessageFallback({ namespace, key, error }) {
        const path = [namespace, key].filter((part) => part != null).join('.');

        if (error.code === IntlErrorCode.MISSING_MESSAGE) {
            return path + ' is not yet translated';
        } else {
            return 'Dear developer, please fix this message: ' + path;
        }
    },
    formats: {
        dateTime: {
            short: {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }
        },
        number: {
            precise: {
                maximumFractionDigits: 5
            }
        },
        list: {
            enumeration: {
                style: 'long',
                type: 'conjunction'
            }
        }
    },
    now: new Date(),
    messages: (
        await (locale === 'en'
            ? // When using Turbopack, this will enable HMR for `en`
            import('./messages/en.json')
            : import(`./messages/${locale}.json`))
    ).default
}));