'use client';
import { useTheme } from '@/context/ThemeContext';
import { FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const TopNav = ({ onMobileToggle }: { onMobileToggle: () => void }) => {
    const { toggleTheme, isDark, theme } = useTheme();
    const path = usePathname();
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        const segments = path.split('/').filter(Boolean);
        const name = segments[segments.length - 1] || 'Dashboard';
        setPageTitle(name.charAt(0).toUpperCase() + name.slice(1));
    }, [path]);

    return (
        <header
        className="w-full flex justify-between items-center px-4 py-3"
            style={{
                backgroundColor:theme.BACKGROUND,
                color: theme.TEXT,
                borderBottom: `1px solid ${theme.TEXT}66`
            }}
        >
            <div className="flex items-center gap-3">
                <button className="md:hidden" onClick={onMobileToggle}>
                    <FiMenu />
                </button>
                {/* Breadcrumbs */}
                <div className="hidden sm:block text-sm text-gray-500">
                    {path
                        .split('/')
                        .filter(Boolean)
                        .map((seg, i, arr) => (
                            <span key={i}>
                                {seg}
                                {i < arr.length - 1 ? ' / ' : ''}
                            </span>
                        ))}
                </div>
                <div className="block sm:hidden font-semibold">{pageTitle}</div>
            </div>
            <button onClick={toggleTheme}>{isDark ? <FiSun /> : <FiMoon />}</button>
        </header>
    );
};
