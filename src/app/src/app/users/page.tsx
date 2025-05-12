'use client'
import { AddUserModal } from '@/components/AddUserModal';
import { Layout } from '@/components/Navigation/Layout';
import { PaginatedResponse, Pagination } from '@/components/Pagination';
import { useFetch } from '@/hooks/useFetch';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

async function fetchUsers(page: number, limit: number): Promise<{
    data: User[],
    meta: any
}> {
    const res = await fetch(`${process.env.API_BASE_URL}/users?page=${page}&limit=${limit}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }

    return res.json();
}

export default function UsersPage() {
    // const users = await fetchUsers(1, 10);
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(10)

    const { data: users, } = useFetch<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`)

    const handlePagination = (
        page: number,
        limit: number
    ) => {
        setPage(page);
        setLimit(limit);
    }

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4 flex flex-row justify-between">
                Users
                <AddUserModal />
            </h1>
            <ul className="space-y-2">
                {users?.data?.map((user: User) => (
                    <li key={user.id} className="p-4 border rounded shadow">
                        <div><strong>{user.name}</strong></div>
                        <div>{user.email}</div>
                        <div className="text-sm text-gray-500">Created: {new Date(user.createdAt).toLocaleString()}</div>
                    </li>
                ))}
            </ul>
            <Pagination
                page={page}
                limit={limit}
                onChange={handlePagination}
                total={users?.meta?.total as number}
            />
        </Layout>
    );
}
