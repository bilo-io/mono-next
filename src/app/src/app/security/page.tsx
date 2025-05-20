 
'use client'
import { Layout } from '@/components/Navigation/Layout';
import { Tabs } from '@/components/ui/Tabs';
import { PermissionsView } from '@/components/Views/Security/PermissionsView';
import { RolesView } from '@/components/Views/Security/RolesView';
import { useState } from 'react';

export interface Permission {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([])

    return (
        <Layout>
            <Tabs
                tabs={[
                    {
                        label: 'Roles',
                        view: <RolesView permissions={permissions} />,
                    },
                    {
                        label: 'Permissions',
                        view: <PermissionsView onUpdatePermissions={setPermissions} />,
                    },
                ]}
            />

        </Layout>
    );
}
