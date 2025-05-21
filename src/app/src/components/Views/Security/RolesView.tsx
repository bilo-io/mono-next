'use client'

import { Table } from '@/components/Table';
import { type PaginatedResponse } from '@/components/Pagination';
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
import { AddRoleModal } from '@/components/Modals/AddRoleModal';
import { Permission } from './PermissionsView';
import { PermissionPill } from './PermissionPill';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { BiPencil, BiTrash } from 'react-icons/bi';
import { FaCirclePlus } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import { AddResourceLabel } from '@/components/ui/AddResourceLabel';

export interface Role {
    id: string | number;
    name: string;
    permissions: { id: string, name: string }[]
}

// #region VIEW CONFIG
const columns: ColDef<Role>[] = [
    { headerName: 'ID', field: 'id', width: 90 },
    { headerName: 'Name', field: 'name', flex: 1 },
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
type RolesViewProps = {
    permissions: Permission[]
}

export const RolesView: React.FC<RolesViewProps> = ({
    permissions
}) => {
    // #region HOOKS
    const { showToast } = useToast()
    const [view, setView] = useState<ViewType>('list');
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
    const [query,] = useState<{
        page: number,
        limit: number
    }>({
        page: 1,
        limit: 10
    });
    // #endregion

    // #region CRUD
    const { data: roles, loading, retry: fetchData } = useFetch<Role[]>(`/roles?${toQueryString(query)}`, {
        auto: true,
        method: 'GET',
        onError: () => showToast('Data failed to load', 'warning')
    })
    const { retry: createData } = useFetch<PaginatedResponse<Role>>(`/roles/create`, {
        auto: false,
        method: 'POST',
        onSuccess: () => {
            showToast('Data created', 'success')
            fetchData()
        },
    })
    const { retry: deleteItem } = useFetch<Role>(`/roles`, {
        auto: false,
        method: 'DELETE',
        onSuccess: () => {
            showToast('Role deleted successfully', 'success')
            fetchData()
        },
        onError: () => {
            showToast('Role deletion failed', 'error')
        }
    })
    // #endregion

    // #region HANDLERS
    const handleCreate = async (data: Role) => {
        try {
            await createData({
                name: data.name,
                permissionIds: data.permissions.map((p: any) => p?.value)
            });
        } catch (err) {
            console.error('Failed to create', err);
        }
    };
    // #endregion

    const renderMenuItems = (item: Permission) => [
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
        <div>
            <div className="text-md mb-4 flex flex-col flex-wrap-reverse md:flex-row md:flex-nowrap items-center justify-between">
                <div>
                    Define Roles that have a set of Permissions. Once defined, roles can be assigned to users.
                </div>

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
                    <AddRoleModal
                        buttonText={<AddResourceLabel />}
                        onSubmit={handleCreate}
                        permissions={permissions}
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
                hasData={(roles?.length && roles?.length > 0) as boolean}
                loader={<Spinner />}
                preloader={<SkeletonList count={3} />}>
                <>
                    {view === 'table' && (
                        <Table<Role>
                            rowData={roles || []}
                            columnDefs={columns}
                            height={'500px'}
                        />
                    )}
                    {view === 'list' && (
                        <ul className="space-y-2">
                            {roles?.map((role: Role) => (
                                <li key={role.id} className="p-4 border rounded shadow flex flex-row items-center justify-between">
                                    <div>
                                        <div><strong>{role.name}</strong></div>
                                        <div><span className='text-sm'>Permissions</span>:
                                            <span className='flex flex-row flex-wrap'>
                                                {
                                                    role.permissions.map((permission: { id: string, name: string }) => (
                                                        <PermissionPill key={permission.id} permission={permission} />
                                                    ))
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <ContextMenu items={renderMenuItems(role)} />
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            </Async>
        </div>
    )
}
