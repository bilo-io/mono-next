'use client'
// import { AddTenantModal } from '@/components/AddTenantModal';
import { Layout } from '@/components/Navigation/Layout';
import { Table } from '@/components/Table';
import { type PaginatedResponse, Pagination } from '@/components/Pagination';
import { useFetch } from '@/hooks/useFetch';
import { ReactNode, useState } from 'react';
import type { ColDef } from 'ag-grid-community'
import { Toggle } from '@/components/Toggle';
import { FiTable, FiList } from 'react-icons/fi';

interface Tenant {
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
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [view, setView] = useState<ViewType>('list');

    const { data: tenants, } = useFetch<PaginatedResponse<Tenant>>(`/tenants?page=${page}&limit=${limit}`)

    const handlePagination = (
        page: number,
        limit: number
    ) => {
        setPage(page);
        setLimit(limit);
    }

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
                    {/* <AddTenantModal /> */}
                </div>
            </div>

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

            <Pagination
                page={page}
                limit={limit}
                onChange={handlePagination}
                total={tenants?.meta?.total as number}
            />
        </Layout>
    );
}
