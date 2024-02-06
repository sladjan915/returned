import { AppError } from '~/server/error';

export function UNREACHABLE_CODE(): never {
    throw new AppError('unreachable-code');
}
