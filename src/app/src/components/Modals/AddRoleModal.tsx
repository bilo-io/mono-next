/* eslint-disable @typescript-eslint/ban-ts-comment */
// components/modals/AddRoleModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Role } from '@/components/Views/Security/RolesView';

import Select, { DropdownValue } from '../ui/Select';
import { Permission } from '@/app/security/page';

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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                }}
                                placeholder="Jane Doe"
                            />
                        </div>

                        <label>
                            Permissions:
                            <Select
                                isMulti
                                value={rolePermissions as string[]}
                                onChange={data => setRolePermissions(data)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                }}
                                // @ts-ignore
                                options={
                                    permissions.map((p: Permission) => ({
                                        label: p.name,
                                        value: p.id,
                                    }))
                                }
                            />
                        </label>
                    </div>
                </Modal>
            )}
        </>
    );
};
