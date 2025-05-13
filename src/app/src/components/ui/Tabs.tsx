import { ReactNode, useState } from 'react';
import { clsx } from 'clsx'; // Optional: for combining classNames
import { useTheme } from '@/context/ThemeContext';

interface Tab {
    label: ReactNode;
    view: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    initialIndex?: number;
    className?: string;
}

export const Tabs = ({ tabs, initialIndex = 0, className }: TabsProps) => {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const { theme } = useTheme();

    return (
        <div className={clsx('w-full', className)}>
            {/* Header */}
            <div className="flex border-b border-gray-300">
                {tabs.map((tab, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={clsx(
                                'px-4 py-2 -mb-px transition-colors border-b-2',
                                isActive
                                    ? 'font-medium'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            )}
                            style={
                                isActive
                                    ? {
                                        color: theme.PRIMARY,
                                        borderBottomColor: theme.PRIMARY,
                                        borderBottomWidth: '2px',
                                    }
                                    : {}
                            }
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Body */}
            <div className="pt-4">
                {tabs[activeIndex]?.view}
            </div>
        </div>
    );
};
