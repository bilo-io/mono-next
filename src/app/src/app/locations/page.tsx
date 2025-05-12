'use client'
// import { AddLocationModal } from '@/components/AddLocationModal';
import { Layout } from '@/components/Navigation/Layout';
import { Table } from '@/components/Table';
import { type PaginatedResponse, Pagination } from '@/components/Pagination';
import { useFetch } from '@/hooks/useFetch';
import { ReactNode, useState } from 'react';
import type { ColDef } from 'ag-grid-community'
import { Toggle } from '@/components/Toggle';
import { FiTable, FiList } from 'react-icons/fi';

interface Location {
    id: number;
    name: string;
    tenant: { name: string }; // assuming tenant is an object with name
    address: string;
    lat: number;
    lon: number;
    createdAt: string;
    updatedAt: string;
}

// #region VIEW CONFIG
const columns: ColDef<Location>[] = [
    { headerName: 'ID', field: 'id', width: 90 },
    { headerName: 'Name', field: 'name', flex: 1 },
    // { headerName: 'Tenant', field: 'tenant', flex: 1 },  // Accessing tenant name
    { headerName: 'Address', field: 'address', flex: 1 },
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

export default function LocationsPage() {
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)
    const [view, setView] = useState<ViewType>('list');

    const { data: locations, } = useFetch<PaginatedResponse<Location>>(`/locations?page=${page}&limit=${limit}`)

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
                <div>Locations</div>
                <div className="flex flex-row h-full items-center gap-8">
                    <Toggle<ViewType>
                        value={view}
                        onChange={setView}
                        options={viewOptions}
                    />
                    {/* <AddLocationModal /> */}
                </div>
            </div>

            {view === 'table' && (
                <Table<Location>
                    rowData={locations?.data || []}
                    columnDefs={columns}
                    height={'500px'}
                />
            )}

            {view === 'list' && (
                <ul className="space-y-2">
                    {locations?.data?.map((location: Location) => (
                        <li key={location.id} className="p-4 border rounded shadow">
                            <div><strong>{location.name}</strong></div>
                            <div>{location.address}</div>
                            <div className="text-sm text-gray-500">
                                Tenant: {location.name} | Lat: {location.lat}, Lon: {location.lon}
                            </div>
                            <div className="text-sm text-gray-500">Created: {new Date(location.createdAt).toLocaleString()}</div>
                        </li>
                    ))}
                </ul>
            )}

            <Pagination
                page={page}
                limit={limit}
                onChange={handlePagination}
                total={locations?.meta?.total as number}
            />
        </Layout>
    );
}
