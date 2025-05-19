'use client'

import { Table } from '@/components/Table';
import { type PaginatedResponse, Pagination } from '@/components/Pagination';
import { useFetch } from '@/hooks/useFetch';
import { ReactNode, useState } from 'react';
import type { ColDef } from 'ag-grid-community'
import { Toggle } from '@/components/Toggle';
import { FiTable, FiList } from 'react-icons/fi';
import Async from '@/components/Async';
import { Spinner } from '@/components/ui/Spinner';
import { SkeletonList } from '@/components/ui/Skeleton/views/SkeletonList';
import { ToggleFilters } from '@/components/FilterForm/ToggleFilters';
import { toQueryString } from '@/util/query';
import { Collapsible } from '@/components/ui/Collapsible';
import { useToast } from '@/context/ToastProvider';

export interface Permission {
    id: string | number;
    name: string;
}

// #region VIEW CONFIG
const columns: ColDef<Permission>[] = [
    { headerName: 'ID', field: 'id', width: 90 },
    { headerName: 'Name', field: 'name', flex: 1 },
    // { headerName: 'Email', field: 'email', flex: 1 },
    // {
    //     headerName: 'Created',
    //     field: 'createdAt',
    //     valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
    //     flex: 1,
    // },
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

export const PermissionsView: React.FC<any> = () => {
    // #region HOOKS
    const [view, setView] = useState<ViewType>('list');
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<any>({
        page: 1,
        limit: 10
    });

    const { showToast } = useToast()
    const { data: permissions, loading, retry: fetchData } = useFetch<PaginatedResponse<Permission>>(`/permissions?${toQueryString(query)}`, {
        auto: true,
        method: 'GET',
        onSuccess: () => showToast('Data loaded', 'success'),
        onError: (error: unknown) => {
            showToast(`Data failed to load\n${error?.message}`, 'warning')
            console.log({ error })
        }
    })
    const { retry: createData } = useFetch<PaginatedResponse<Permission>>(`/permissions`, {
        auto: false,
        method: 'POST',
        onSuccess: () => {
            showToast('Data created', 'success')
            fetchData()
        },
    })
    // #endregion

    // #region HANDLERS
    const handlePagination = (
        page: number,
        limit: number
    ) => {
        setQuery((prev: any) => ({ ...prev, page, limit }))
    }

    const handleCreate = async (data: Permission) => {
        try {
            await createData(data);
        } catch (err) {
            console.error('Failed to create', err);
        }
    };
    // #endregion

    return (
        <div>
            <div className="text-2xl font-bold mb-4 flex flex-row items-center justify-between">
                {/* <div>Permissions</div> */}
                <div />
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
                    {/* <AddPermissionModal
                        buttonText={'+ Add'}
                        onSubmit={handleCreate}
                    /> */}
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
                hasData={(permissions?.data?.length && permissions?.data?.length > 0) as boolean}
                loader={<Spinner />}
                preloader={<SkeletonList count={3} />}>
                <>
                    {view === 'table' && (
                        <Table<Permission>
                            rowData={permissions?.data || []}
                            columnDefs={columns}
                            height={'500px'}
                        />
                    )}
                    {view === 'list' && (
                        <ul className="space-y-2">
                            {permissions?.data?.map((permission: Permission) => (
                                <li key={permission.id} className="p-4 border rounded shadow">
                                    <div><strong>{permission.name}</strong></div>
                                    <div>{permission.email}</div>
                                    <div className="text-sm text-gray-500">Created: {new Date(permission.createdAt).toLocaleString()}</div>
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
                total={permissions?.meta?.total as number}
            />
        </div>
    )
}
