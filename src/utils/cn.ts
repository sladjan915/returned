import { type SlotsToClasses } from '@nextui-org/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(...inputs));
}

export function cns<T extends string>(
    slots?: SlotsToClasses<T>,
    overrideSlots?: SlotsToClasses<T>
) {
    const cnSlots = {} as SlotsToClasses<T>;

    for (const key in slots) {
        cnSlots[key] = slots[key];

        if (overrideSlots?.hasOwnProperty(key)) {
            cnSlots[key] = cn(cnSlots[key], overrideSlots[key]);
        }
    }

    return cnSlots;
}
