'use client';
import React, { useEffect } from 'react';
import Button from './ui/Button';

interface AsyncProps {
    onMount?: () => void;
    margin?: string | number;
    isLoading?: boolean;
    hasData?: boolean;
    loader?: React.ReactElement | string | null;
    preloader?: React.ReactElement | string | null;
    onRefresh?: () => void;
    children: React.ReactElement | React.ReactElement[];
}

export const Async: React.FC<AsyncProps> = ({
    onMount = () => { },
    margin = '0rem',
    isLoading = false,
    hasData = false,
    loader,
    preloader,
    onRefresh,
    children,
}) => {
    useEffect(() => {
        onMount?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading && !hasData) {
        return (
            <div
                style={{
                    margin: 'auto',
                    marginBottom: margin,
                    marginTop: margin,
                }}
            >
                {preloader || <div className="skeleton h-32 w-full rounded-md bg-gray-200" />}
            </div>
        );
    }

    if (isLoading && hasData) {
        return (
            <div>
                <div
                    style={{
                        margin: 'auto',
                        marginBottom: margin,
                        marginTop: margin,
                    }}
                >
                    {loader || <div className="loader" />}
                </div>
                {children}
            </div>
        );
    }

    if (!isLoading && hasData) {
        return <>{children}</>;
    }

    return (
        <div className="flex justify-center items-center py-4">
            <Button variant='outline' onClick={onRefresh}>Refresh</Button>
        </div>
    );
};

export default Async;
