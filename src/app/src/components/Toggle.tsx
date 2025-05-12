// src/components/Toggle.tsx
'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

interface ToggleOption<T> {
    value: T;
    icon: ReactNode;
}

interface ToggleProps<T> {
    options: ToggleOption<T>[];
    value: T;
    onChange: (value: T) => void;
}

export const Toggle = <T,>({ options, value, onChange }: ToggleProps<T>) => {
    return (
        <div className="inline-flex rounded border overflow-hidden">
            {options.map((option) => (
                <button
                    key={option.value as string}
                    onClick={() => onChange(option.value)}
                    className={clsx(
                        'px-3 py-1 flex items-center gap-1 text-sm font-medium transition-colors',
                        value === option.value ? 'bg-gray-200 text-black' : 'bg-white text-gray-500 hover:bg-gray-100'
                    )}
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
};
