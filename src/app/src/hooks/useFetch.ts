/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface FetchResult<T> {
     
    retry: (overrideBody?: Record<string, T | any> | FormData | string) => void;
    data: T | null;
    loading: boolean;
    error: Error | null;
}

interface FetchConfig<T> {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, T> | FormData | string;
    headers?: HeadersInit;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    auto?: boolean;
}

export function useFetch<T>(
    path: string,
    config: FetchConfig<T> = {},
    deps: unknown[] = []
): FetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(
        async (overrideBody?: Record<string, T> | FormData | string) => {
            setLoading(true);
            const { method = 'GET', headers, onSuccess, onError } = config;

            try {
                const body = overrideBody ?? config.body;

                const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
                const finalHeaders =
                    headers || (body && !isFormData ? { 'Content-Type': 'application/json' } : {});

                const res = await fetch(`${BASE_URL}${path}`, {
                    method,
                    headers: finalHeaders,
                    body: body
                        ? isFormData
                            ? body
                            : typeof body === 'string'
                                ? body
                                : JSON.stringify(body)
                        : undefined,
                    cache: 'no-store',
                });

                const contentType = res.headers.get('content-type');
                const isJson = contentType?.includes('application/json');

                if (!res.ok) {
                    const errorBody = isJson ? await res.json() : { message: res.statusText };
                    const errorMessage = errorBody?.message || 'Unknown error';
                    const errorObj = new Error(errorMessage);
                    (errorObj as any).status = res.status;
                    (errorObj as any).details = errorBody;

                    console.log('try', { error })

                    // onError?.(errorObj)
                    throw errorObj;
                }

                const json = isJson ? await res.json() : null;

                setData(json);
                setError(null);
                onSuccess?.(json);
            } catch (err: unknown) {
                const errorObj = err as any;
                console.log('catch', { error })
                setError(errorObj);
                setData(null);
                onError?.(errorObj);
            } finally {
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [path, JSON.stringify(config), ...deps]
    );

    useEffect(() => {
        if (config?.auto ?? true) {
            fetchData();
        }
    }, [fetchData, config?.auto]);

    return {
        data,
        loading,
        error,
        retry: fetchData,
    };
}
