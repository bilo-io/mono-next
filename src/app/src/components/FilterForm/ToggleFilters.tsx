'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { IoFilterSharp } from 'react-icons/io5';

interface ToggleFiltersProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isOpen: boolean;
}

export const ToggleFilters: React.FC<ToggleFiltersProps> = ({
    isOpen,
    ...rest
}) => {
    const { theme } = useTheme();

    return (
        <button
            type="button"
            aria-label="Toggle Filters"
            style={{
                color: isOpen ? theme.PRIMARY : theme.TEXT,
            }}
            className="flex items-center justify-center p-2 rounded-md bg-transparent border-0 cursor-pointer transition-colors duration-300"
            {...rest}
        >
            <IoFilterSharp size={20} />
        </button>
    );
};
