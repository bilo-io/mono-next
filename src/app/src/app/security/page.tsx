 
'use client'
import { Layout } from '@/components/Navigation/Layout';
import { Tabs } from '@/components/ui/Tabs';
import { PermissionsView } from '@/components/Views/Security/PermissionsView';
import { RolesView } from '@/components/Views/Security/RolesView';

export interface Permission {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export default function PermissionsPage() {
    return (
        <Layout>
            <Tabs
                tabs={[
                    {
                        label: 'Roles',
                        view: <RolesView />,
                    },
                    {
                        label: 'Permissions',
                        view: <PermissionsView />,
                    },
                ]}
            />

        </Layout>
    );
}


{/*  */ }