 
'use client'
import { Layout } from '@/components/Navigation/Layout';
import { Tabs } from '@/components/ui/Tabs';
import { PermissionsView } from '@/components/Views/Security/PermissionsView';
import { RolesView } from '@/components/Views/Security/RolesView';
import { useState } from 'react';

export interface Permission {
    id: string | number;
    name: string;
}

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([])

    return (
        <Layout>
            <Tabs
                tabs={[
                    {
                        label: 'Permissions',
                        view: <PermissionsView onUpdate={(permissions: Permission[]) => setPermissions(permissions)} />,
                    },
                    {
                        label: 'Roles',
                        view: <RolesView permissions={permissions} />,
                    },
                ]}
            />

        </Layout>
    );
}
