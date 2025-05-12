import { useCallback, useEffect, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface FetchResult<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    retry: () => void;
}

export function useFetch<T>(path: string, options: unknown[] = []): FetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}${path}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Error: ${res.statusText}`);
            const json = await res.json();
            setData(json);
            setError(null);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [path, ...options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, retry: fetchData };
}
