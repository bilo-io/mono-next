/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Layout } from '@/components/Navigation/Layout';
import { Table } from '@/components/Table';
import { type PaginatedResponse, Pagination } from '@/components/Pagination';
import { useFetch } from '@/hooks/useFetch';
import { ReactNode, useState } from 'react';
import type { ColDef } from 'ag-grid-community'
import { Toggle } from '@/components/Toggle';
import { FiTable, FiList } from 'react-icons/fi';
import { FilterField } from '@/components/FilterForm/FilterForm';
import { AddLocationModal } from '@/components/Modals/AddLocationModal';
import { ToggleFilters } from '@/components/FilterForm/ToggleFilters';
import { toQueryString } from '@/util/query';
import { Collapsible } from '@/components/ui/Collapsible';
import { Spinner } from '@/components/ui/Spinner';
import { SkeletonList } from '@/components/ui/Skeleton/views/SkeletonList';
import Async from '@/components/Async';
import { useToast } from '@/context/ToastProvider';
import { AddResourceLabel } from '@/components/ui/AddResourceLabel';

export interface Location {
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
    { headerName: 'Address', field: 'address', flex: 1 },
];

type ViewType = 'table' | 'list';
const viewOptions: {
    value: ViewType,
    icon: ReactNode
}[] = [
    { value: 'table', icon: <FiTable className="w-4 h-4" /> },
    { value: 'list', icon: <FiList className="w-4 h-4" /> },
];

const filterFields: FilterField[] = [
    {
        name: 'name',
        label: 'Location Name',
        type: 'text',
        placeholder: 'Filter by location name',
    },
    {
        name: 'address',
        label: 'Address',
        type: 'text',
        placeholder: 'Filter by address',
    },
    {
        name: 'lat',
        label: 'Latitude',
        type: 'text',
        placeholder: 'Filter by latitude',
    },
    {
        name: 'lon',
        label: 'Longitude',
        type: 'text',
        placeholder: 'Filter by longitude',
    },
    {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: '', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
        ],
    },
];
// #endregion

export default function LocationsPage() {
    // #region HOOKS
    const [view, setView] = useState<ViewType>('list');
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
    const [query, setQuery] = useState<any>({
        page: 1,
        limit: 10
    });
    
    const { showToast } = useToast()
    const { data: locations, loading, retry: fetchData } = useFetch<PaginatedResponse<Location>>(`/locations?${toQueryString(query)}`, {
        auto: true,
        method: 'GET',
        onError: () => showToast('Data failed to load', 'warning')
    })
    const { retry: createData } = useFetch<PaginatedResponse<Location>>(`/locations`, {
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
        setQuery((prev: any) => ({
            ...prev,
            page,
            limit
        }))
    }

    const handleFilterChange = (newQuery: any) => {
        setQuery((prev: any) => ({ ...prev, newQuery }));
        console.log('Current query:', newQuery); // This is where you can use the query for your fetch logic
    };
    // #endregion

    const handleCreate = async (data: Location) => {
        try {
            await createData(data);
        } catch (err) {
            console.error('Failed to create', err);
        }
    };

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
                    <ToggleFilters
                        isOpen={isFiltersOpen}
                        onClick={() => setIsFiltersOpen((prev) => !prev)}
                    />
                    <AddLocationModal
                        buttonText={<AddResourceLabel />}
                        onSubmit={handleCreate}
                        tenants={[
                            {
                                id: 1,
                                name: 'Test'
                            }
                        ]}
                    />
                </div>
            </div>


            <Collapsible isOpen={isFiltersOpen}>
                <div className='my-12'>
                    Filters
                </div>

                {/* <FilterForm
                    onChange={handleFilterChange}
                    initialValues={query}
                    fields={filterFields}
                /> */}
            </Collapsible>


            <Async
                isLoading={loading}
                onRefresh={fetchData}
                hasData={(locations?.data?.length && locations?.data?.length > 0) as boolean}
                loader={<Spinner />}
                preloader={<SkeletonList count={10} />}>
                <>
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
                                    {/* <div className="text-sm text-gray-500">Created: {new Date(location.createdAt).toLocaleString()}</div> */}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            </Async>

            <Pagination
                page={query?.page}
                limit={query?.limit}
                onChange={handlePagination}
                total={locations?.meta?.total as number}
            />
        </Layout>
    );
}
