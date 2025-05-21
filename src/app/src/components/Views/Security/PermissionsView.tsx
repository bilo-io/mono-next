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
import { AddPermissionModal } from '@/components/Modals/AddPermissionModal';
import { PermissionPill } from './PermissionPill';
import { ContextMenu } from '@/components/ui/ContextMenu';
import { BiPencil, BiTrash } from 'react-icons/bi';
import { Permission } from '@/app/security/page';
import { AddResourceLabel } from '@/components/ui/AddResourceLabel';

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
type PermissionsViewProps = {
    onUpdate: (permissions: Permission[]) => void
};

export const PermissionsView: React.FC<PermissionsViewProps> = ({
    onUpdate
}) => {
    // #region HOOKS
    const [view, setView] = useState<ViewType>('list');
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
    const [query,] = useState<{
        page: number,
        limit: number
    }>({
        page: 1,
        limit: 10
    });

    const { showToast } = useToast()
    const { data: permissions, loading, retry: fetchData } = useFetch<Permission[]>(`/permissions?${toQueryString(query)}`, {
        auto: true,
        method: 'GET',
        onSuccess: (data) => {
            onUpdate(data)
        },
        onError: (error: unknown) => {
            // @ts-expect-error cutting corners
            showToast(`Data failed to load\n${error?.message}`, 'warning')
            console.log({ error })
        }
    })
    const { retry: createData } = useFetch<PaginatedResponse<Permission>>(`/permissions/create`, {
        auto: false,
        method: 'POST',
        onSuccess: () => {
            showToast('Data created', 'success')
            fetchData()
        },
    })
    const { retry: deleteItem } = useFetch<Permission>(`/permissions`, {
        auto: false,
        method: 'DELETE',
        onSuccess: () => {
            showToast('Permission deleted successfully', 'success')
            fetchData()
        },
        onError: () => {
            showToast('Permission deletion failed', 'error')
        }
    })
    // #endregion

    // #region HANDLERS
    const handleCreate = async (data: Permission) => {
        try {
            await createData(data);
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
            <div className="text-md mb-4 flex flex-row items-center justify-between">
                <div>Manage permissions for various tasks, and then assign these to Roles</div>
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
                    <AddPermissionModal
                        buttonText={<AddResourceLabel />}
                        onSubmit={handleCreate}
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
                hasData={(permissions?.length && permissions?.length > 0) as boolean}
                loader={<Spinner />}
                preloader={<SkeletonList count={3} />}>
                <>
                    {view === 'table' && (
                        <Table<Permission>
                            rowData={permissions || []}
                            columnDefs={columns}
                            height={'500px'}
                        />
                    )}
                    {view === 'list' && (
                        <ul className="space-y-2">
                            {permissions?.map((permission: Permission) => (
                                <li key={permission.id} className="p-4 border rounded shadow flex flex-row items-center justify-between">
                                    <PermissionPill permission={permission} />
                                    <ContextMenu items={renderMenuItems(permission)} />
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            </Async>
        </div>
    )
}
