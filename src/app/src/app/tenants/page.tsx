/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Layout } from '@/components/Navigation/Layout';
import { Table } from '@/components/Table';
import { type PaginatedResponse, Pagination } from '@/components/Pagination';
import { useFetch } from '@/hooks/useFetch';
import { ReactNode, useEffect, useState } from 'react';
import type { ColDef } from 'ag-grid-community'
import { Toggle } from '@/components/Toggle';
import { FiTable, FiList } from 'react-icons/fi';
import { AddTenantModal } from '@/components/Modals/AddTenantModal';
import { ToggleFilters } from '@/components/FilterForm/ToggleFilters';
import { toQueryString } from '@/util/query';
import Async from '@/components/Async';
import { Spinner } from '@/components/ui/Spinner';
import { SkeletonList } from '@/components/ui/Skeleton/views/SkeletonList';
import { Collapsible } from '@/components/ui/Collapsible';
import { useToast } from '@/context/ToastProvider';

export interface Tenant {
    id: number;
    name: string;
    domain: string;
    createdAt: string;
    updatedAt: string;
}

// #region VIEW CONFIG
const columns: ColDef<Tenant>[] = [
    { headerName: 'ID', field: 'id', width: 90 },
    { headerName: 'Name', field: 'name', flex: 1 },
    { headerName: 'Domain', field: 'domain', flex: 1 },
    {
        headerName: 'Created',
        field: 'createdAt',
        valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
        flex: 1,
    },
];

type ViewType = 'table' | 'list';
const viewOptions: {
    value: ViewType,
    icon: ReactNode
}[] = [
        { value: 'table', icon: <FiTable className="w-4 h-4" /> },
        { value: 'list', icon: <FiList className="w-4 h-4" /> },
    ];
// #endregion

export default function TenantsPage() {
    // #region HOOKS
    const [view, setView] = useState<ViewType>('list');
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<any>({
        page: 1,
        limit: 10
    });
    
    const { showToast } = useToast()
    const { data: tenants, loading, retry: fetchData } = useFetch<PaginatedResponse<Tenant>>(`/tenants?${toQueryString(query)}`, {
        auto: true,
        // onSuccess: () => showToast('Data loaded', 'success'),
        onError: () => showToast('Data failed to load', 'warning')
    })
    const { retry: createData } = useFetch<Tenant>('/tenants', {
        auto: false,
        method: 'POST',
        onError: () => showToast('Data failed to create', 'error'),
        onSuccess: () => {
            showToast('Data created', 'success')
            fetchData()
        },
    });
    // #endregion 

    // #region HANDLERS
    const handlePagination = (
        page: number,
        limit: number
    ) => {
        setQuery((prev: any) => ({ ...prev, page, limit }))
    }

    const handleCreate = async (data: Tenant) => {
        try {
            await createData(data);
        } catch (err) {
            console.error('Failed to create', err);
        }
    };
    // #endregion

    return (
        <Layout>
            <div className="text-2xl font-bold mb-4 flex flex-row items-center justify-between">
                <div>Tenants</div>
                <div className="flex flex-row h-full items-center gap-8">
                    <Toggle<ViewType>
                        value={view}
                        onChange={setView}
                        options={viewOptions}
                    />
                    <ToggleFilters
                        isOpen={isFiltersOpen}
                        onClick={() => setIsFiltersOpen((prev) => !prev)}
                    />
                    <AddTenantModal buttonText={'+ Add'} onSubmit={handleCreate} />
                </div>
            </div>

            <Collapsible isOpen={isFiltersOpen}>
                <div className='my-12'>
                    Filters
                </div>
            </Collapsible>


            <Async
                isLoading={loading}
                onRefresh={fetchData}
                hasData={(tenants?.data?.length && tenants?.data?.length > 0) as boolean}
                loader={<Spinner />}
                preloader={<SkeletonList count={10} />}>
                <>
                    {view === 'table' && (
                        <Table<Tenant>
                            rowData={tenants?.data || []}
                            columnDefs={columns}
                            height={'500px'}
                        />
                    )}

                    {view === 'list' && (
                        <ul className="space-y-2">
                            {tenants?.data?.map((tenant: Tenant) => (
                                <li key={tenant.id} className="p-4 border rounded shadow">
                                    <div><strong>{tenant.name}</strong></div>
                                    <div>{tenant.domain}</div>
                                    <div className="text-sm text-gray-500">Created: {new Date(tenant.createdAt).toLocaleString()}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            </Async>

            <Pagination
                page={query.page}
                limit={query.limit}
                onChange={handlePagination}
                total={tenants?.meta?.total as number}
            />
        </Layout>
    );
}
