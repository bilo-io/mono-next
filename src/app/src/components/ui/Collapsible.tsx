'use client';
import React, { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

interface CollapsibleProps {
    isOpen: boolean;
    duration?: number;
    children: React.ReactNode;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
    isOpen,
    duration = 300,
    children,
}) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState<string>('0px');

    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                const scrollHeight = contentRef.current.scrollHeight;
                setMaxHeight(`${scrollHeight}px`);
            } else {
                setMaxHeight('0px');
            }
        }
    }, [isOpen, children]);

    return (
        <div className="w-full">
            <div
                className={clsx(
                    'transition-all overflow-hidden',
                    isOpen ? 'mb-2' : 'mb-0'
                )}
                style={{
                    maxHeight,
                    transitionDuration: `${duration}ms`,
                }}
                ref={contentRef}
            >
                {children}
            </div>

            {!isOpen && <div className="border-t h-4 border-gray-300 dark:border-gray-600 bg-opacity-10 my-2" />}
        </div>
    );
};
