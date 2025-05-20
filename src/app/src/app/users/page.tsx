/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { AddUserModal } from '@/components/Modals/AddUserModal';
import { Layout } from '@/components/Navigation/Layout';
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
import { Role } from '@/components/Views/Security/RolesView';

export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

// #region VIEW CONFIG
const columns: ColDef<User>[] = [
    { headerName: 'ID', field: 'id', width: 90 },
    { headerName: 'Name', field: 'name', flex: 1 },
    { headerName: 'Email', field: 'email', flex: 1 },
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

export default function UsersPage() {
    // #region HOOKS
    const [view, setView] = useState<ViewType>('list');
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<any>({
        page: 1,
        limit: 10
    });

    const { showToast } = useToast()
    const { data: users, loading, retry: fetchData } = useFetch<PaginatedResponse<User>>(`/users?${toQueryString(query)}`, {
        auto: true,
        method: 'GET',
        onError: () => showToast('Data failed to load', 'warning')
    })
    const { retry: createData } = useFetch<PaginatedResponse<User>>(`/users/create`, {
        auto: false,
        method: 'POST',
        onSuccess: () => {
            showToast('Data created', 'success')
            fetchData()
        },
    })
    const { data: roles, loading: loadingRoles, retry: fetchRolesData } = useFetch<Role[]>(`/roles?${toQueryString(query)}`, {
        auto: true,
        method: 'GET',
        onError: () => showToast('Roles failed to load', 'warning')
    })
    // #endregion

    // #region HANDLERS
    const handlePagination = (
        page: number,
        limit: number
    ) => {
        setQuery((prev: any) => ({ ...prev, page, limit }))
    }

    const handleCreate = async (data: User) => {
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
                <div>Users</div>
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
                    <AddUserModal
                        buttonText={'+ Add'}
                        onSubmit={handleCreate}
                        roles={roles as Role[]}
                    />
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
                hasData={(users?.data?.length && users?.data?.length > 0) as boolean}
                loader={<Spinner />}
                preloader={<SkeletonList count={3} />}>
                <>
                    {view === 'table' && (
                        <Table<User>
                            rowData={users?.data || []}
                            columnDefs={columns}
                            height={'500px'}
                        />
                    )}
                    {view === 'list' && (
                        <ul className="space-y-2 max-h-[85vh] overflow-hidden overflow-y-auto">
                            {users?.data?.map((user: User) => (
                                <li key={user.id} className="p-4 border rounded shadow">
                                    <div><strong>{user.name}</strong></div>
                                    <div>{user.email}</div>
                                    <div className="text-sm text-gray-500">Created: {new Date(user.createdAt).toLocaleString()}</div>
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
                total={users?.meta?.total as number}
            />
        </Layout>
    );
}


{/*  */ }