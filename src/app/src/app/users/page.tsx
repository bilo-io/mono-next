/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { RolePill } from '@/components/Views/Security/RolePill';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { BiPencil, BiTrash } from 'react-icons/bi';
import { AddResourceLabel } from '@/components/ui/AddResourceLabel';
import { List } from '@/components/List';

export interface User {
    id?: number;
    name: string;
    email: string;
    roles: { label: string, value: string }[];
    createdAt?: string;
    updatedAt?: string;
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
    const { retry: createData } = useFetch<PaginatedResponse<User>>(`/users`, {
        auto: false,
        method: 'POST',
        onSuccess: () => {
            showToast('Data created', 'success')
            fetchData()
        },
    })
    const { retry: deleteItem } = useFetch<User>(`/users`, {
        auto: false,
        method: 'DELETE',
        onSuccess: () => {
            showToast('User deleted successfully', 'success')
            fetchData()
        },
        onError: () => {
            showToast('User deletion failed', 'error')
        }
    })
    const { data: roles, loading: loadingRoles } = useFetch<Role[]>(`/roles?${toQueryString(query)}`, {
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
            const newUser = {
                ...data,
                // @ts-ignore
                roleIds: data.roleIds, // NB: these are actually roleIds from the form
                roles: undefined
            }

            console.log({ newUser })

            await createData(newUser);
        } catch (err) {
            console.error('Failed to create', err);
        }
    };
    // #endregion

    const renderMenuItems = (item: User) => [
        {
            label: 'Edit',
            icon: <BiPencil />,
            onClick: () => { }
        },
        {
            label: 'Delete',
            icon: <BiTrash />,
            onClick: () => deleteItem(item)
        }
    ]



    return (
        <Layout>
            <div className="text-xl mb-4 flex flex-row items-center justify-between">
                <div>Manage users and their roles</div>
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
                        buttonText={<AddResourceLabel />}
                        onSubmit={handleCreate}
                        roles={roles as Role[]}
                        isLoading={loadingRoles}
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
                        <List<User>
                            items={users?.data || []}
                            renderItem={({ item: user }) => (
                                <>
                                    <div>
                                        <div><strong>{user.name}</strong></div>
                                        <div>{user.email}</div>
                                        <div className="flex flex-row flex-wrap">
                                            {/* @ts-ignore */}
                                            {user.roles.map((role: Role) => (
                                                <RolePill key={role.id} role={role} />
                                            ))}
                                        </div>
                                    </div>
                                    <ContextMenu items={renderMenuItems(user)} />
                                </>
                            )}
                        />

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
