/* eslint-disable @typescript-eslint/ban-ts-comment */
// components/modals/AddRoleModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Role } from '@/components/Views/Security/RolesView';

import { DropdownValue } from '../ui/Select';
import { Permission } from '@/app/security/page';
import FormRole, { FormDataUser } from '../Forms/FormRole';

interface AddRoleModalProps {
    onSubmit: (role: Role) => void;
    buttonText?: React.ReactNode;
    permissions: Permission[]
}

export const AddRoleModal: React.FC<AddRoleModalProps> = ({
    onSubmit,
    buttonText = 'Add Role',
    permissions
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [rolePermissions, setRolePermissions] = useState<DropdownValue>()

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setName('');
        setRolePermissions([])
    };

    const handleSubmit = () => {
        if (name.trim()) {
            // @ts-ignore
            onSubmit({ name, permissions: rolePermissions });
            handleClose();
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleOpen} size='sm'>
                {buttonText}
            </Button>

            {isOpen && (
                <Modal
                    title="Add New Role"
                    onCancel={handleClose}
                    onSubmit={handleSubmit}
                    submitText="Submit"
                    cancelText="Cancel"
                >
                    <FormRole
                        permissions={permissions}
                        onSubmit={function (data: FormDataUser): void {
                            setName(data.name)
                            setRolePermissions(data.permissions)
                        }}
                    />
                </Modal>
            )}
        </>
    );
};
