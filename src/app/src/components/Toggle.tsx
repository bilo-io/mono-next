// src/components/Toggle.tsx
'use client';

import { useTheme } from '@/context/ThemeContext';
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
    const { theme } = useTheme();

    return (
        <div className="inline-flex rounded-lg overflow-hidden">
            {options.map((option) => (
                <button
                    key={option.value as string}
                    onClick={() => onChange(option.value)}
                    className={clsx(
                        'px-4 py-2 flex items-center gap-1 text-sm font-medium transition-colors cursor-pointer',
                        value === option.value ? 'bg-gray-200 text-black' : 'bg-white text-gray-500 hover:bg-gray-100'
                    )}
                    style={{
                        color: value === option.value? '#FFF' : theme.TEXT,
                        background: value === option.value ? theme.PRIMARY : theme.SIDENAV_BG
                    }}
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
};
