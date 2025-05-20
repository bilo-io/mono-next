'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const { theme } = useTheme();

    const variantStyles: Record<Variant, React.CSSProperties> = {
        primary: {
            backgroundColor: theme.PRIMARY,
            color: '#fff',
            border: 'none',
        },
        secondary: {
            backgroundColor: '#64748b',
            color: '#fff',
            border: 'none',
        },
        success: {
            backgroundColor: theme.SUCCESS,
            color: '#fff',
            border: 'none',
        },
        warning: {
            backgroundColor: theme.WARNING,
            color: '#000',
            border: 'none',
        },
        error: {
            backgroundColor: theme.ERROR,
            color: '#fff',
            border: 'none',
        },
        outline: {
            backgroundColor: 'transparent',
            color: theme.PRIMARY,
            border: `2px solid ${theme.PRIMARY}`,
        },
    };

    const sizeStyles: Record<Size, string> = {
        xs: 'text-xs px-2 py-1',
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-5 py-2.5',
        xl: 'text-xl px-6 py-3',
        '2xl': 'text-2xl px-7 py-3.5',
        '3xl': 'text-3xl px-8 py-4',
    };

    return (
        <button
            className={clsx(
                'rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                sizeStyles[size],
                className
            )}
            style={variantStyles[variant]}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;