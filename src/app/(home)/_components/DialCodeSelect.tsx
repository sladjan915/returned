'use client';

import { type Country } from '~/types/country';
import { useState } from 'react';
import { cn } from '~/utils/cn';
import Image from 'next/image';

export default function DialCodeSelect({
    countries,
    selectedCountry,
    onSelect
}: {
    countries: Country[];
    selectedCountry: Country;
    onSelect: (country: Country) => void;
}) {
    const [isExpanded, setExpanded] = useState(false);

    return (
        <div className='relative w-min'>
            <DialCodeSelectHead
                selectedCountry={selectedCountry}
                onClick={() => setExpanded((expanded) => !expanded)}
            />
            {isExpanded && (
                <DialCodeSelectList
                    countries={countries}
                    selectedCountry={selectedCountry}
                    onSelect={(country) => {
                        onSelect(country);
                        setExpanded(false);
                    }}
                />
            )}
        </div>
    );
}

function DialCodeSelectHead({
    selectedCountry,
    onClick
}: {
    selectedCountry: Country;
    onClick: () => void;
}) {
    return (
        <div className='select select-bordered w-full' onClick={onClick}>
            <DialCodeItem country={selectedCountry} style='dialCode' />
        </div>
    );
}

function DialCodeSelectList({
    countries,
    selectedCountry,
    onSelect
}: {
    countries: Country[];
    selectedCountry: Country;
    onSelect: (country: Country) => void;
}) {
    return (
        <div className='bg-base-100 rounded-lg w-[80vw] max-w-sm border-neutral border-2 max-h-96 overflow-y-scroll shadow-2xl absolute top-full left-0 translate-y-2'>
            {countries.map((country) => (
                <div
                    className={cn(
                        'w-full py-2 px-4 cursor-pointer hover:bg-base-200',
                        {
                            'bg-base-200 pointer-events-none':
                                selectedCountry === country
                        }
                    )}
                    onClick={() => onSelect(country)}
                    key={country.code}
                >
                    <DialCodeItem country={country} style='full' />
                </div>
            ))}
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
        <div className='w-full flex-row flex items-center gap-x-3'>
            <div className='avatar'>
                <div className='rounded-full w-5'>
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
