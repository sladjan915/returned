import type en from '~/messages/en.json';
import { translator } from '~/utils/i18n';

const t = translator('en', 'Error');
type ErrorCode = keyof typeof en.Error;

export class AppError extends Error {
    constructor(public readonly errorCode: ErrorCode) {
        super(t(errorCode));
    }
}

export function raise(errorCode: ErrorCode): never {
    throw new AppError(errorCode);
}
