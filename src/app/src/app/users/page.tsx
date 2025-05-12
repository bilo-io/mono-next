// app/dashboard/page.tsx
import { Layout } from '@/components/Navigation/Layout';

interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

async function fetchUsers(): Promise<User[]> {
    const res = await fetch(`${process.env.API_BASE_URL}/users`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }

    return res.json();
}

export default async function UsersPage() {
    const users = await fetchUsers();

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user.id} className="p-4 border rounded shadow">
                        <div><strong>{user.name}</strong></div>
                        <div>{user.email}</div>
                        <div className="text-sm text-gray-500">Created: {new Date(user.createdAt).toLocaleString()}</div>
                    </li>
                ))}
            </ul>
        </Layout>
    );
}
