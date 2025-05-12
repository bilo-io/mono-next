// context/ThemeContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';
import { LIGHT_THEME, DARK_THEME, Theme } from '@/styles/themes';

type ThemeContextType = {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState(false);
    const toggleTheme = () => setIsDark((prev) => !prev);

    const theme = isDark ? DARK_THEME : LIGHT_THEME;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            <div style={{ backgroundColor: theme.BACKGROUND, color: theme.TEXT, minHeight: '100vh' }}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
    return ctx;
};
