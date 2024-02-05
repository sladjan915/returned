import { type Country } from '~/types/country';
import { cn } from '~/utils/cn';
import Image from 'next/image';

export default function DialCodeSelect({
    countries,
    selectedCountry,
    disabled,
    onSelect
}: {
    countries: Country[];
    selectedCountry: Country;
    disabled: boolean;
    onSelect: (country: Country) => void;
}) {
    return (
        <div className='relative w-min'>
            <div
                className={cn(
                    'peer select select-bordered w-full',
                    disabled && 'select-disabled'
                )}
                tabIndex={0}
            >
                <DialCodeItem country={selectedCountry} style='dialCode' />
            </div>
            {!disabled && (
                <div className='absolute left-0 top-full hidden max-h-96 w-[80vw] max-w-sm translate-y-2 flex-col overflow-y-scroll rounded-lg border-2 border-neutral bg-base-100 shadow-2xl active:flex peer-focus:flex'>
                    {countries.map((country) => (
                        <div
                            className={cn(
                                'w-full cursor-pointer px-4 py-2 hover:bg-base-200',
                                selectedCountry === country &&
                                    'pointer-events-none bg-base-200'
                            )}
                            onClick={() => onSelect(country)}
                            key={country.code}
                        >
                            <DialCodeItem country={country} style='full' />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function DialCodeItem({
    country,
    style
}: {
    country: Country;
    style: 'full' | 'dialCode';
}) {
    return (
        <div className='flex w-full flex-row items-center gap-x-3'>
            <div className='avatar'>
                <div className='w-5 rounded-full'>
                    <Image
                        src={country.flagUrl}
                        alt={country.code}
                        width={0}
                        height={0}
                        priority
                    />
                </div>
            </div>
            <div className='line-clamp-1 text-sm'>
                {style === 'full'
                    ? `${country.name} (${country.dialCode})`
                    : country.dialCode}
            </div>
        </div>
    );
}
