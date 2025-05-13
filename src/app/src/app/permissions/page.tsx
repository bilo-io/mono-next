/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Layout } from '@/components/Navigation/Layout';
import { type PaginatedResponse } from '@/components/Pagination';
import { useFetch } from '@/hooks/useFetch';
import { ReactNode, useState } from 'react';
import type { ColDef } from 'ag-grid-community'
import { FiTable, FiList } from 'react-icons/fi';
import { toQueryString } from '@/util/query';
import { useToast } from '@/context/ToastProvider';
import { Tabs } from '@/components/ui/Tabs';
import { PermissionsView } from '@/components/Views/Permissions/PermissionsView';
import { RolesView } from '@/components/Views/Permissions/RolesView';

export interface Permission {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

// #region VIEW CONFIG
const columns: ColDef<Permission>[] = [
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

export default function PermissionsPage() {
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
        onError: () => showToast('Data failed to load', 'warning')
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
        <Layout>
            <Tabs
                tabs={[
                    {
                        label: 'Permissions',
                        view: <PermissionsView />,
                    },
                    {
                        label: 'Roles',
                        view: <RolesView />,
                    },
                ]}
            />

        </Layout>
    );
}


{/*  */ }