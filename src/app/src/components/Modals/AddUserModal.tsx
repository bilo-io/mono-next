/* eslint-disable @typescript-eslint/ban-ts-comment */
// components/modals/AddUserModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { User } from '@/app/users/page';
import Select, { DropdownValue } from '../ui/Select';
import { Role } from '../Views/Security/RolesView';
import { Skeleton } from '../ui/Skeleton/Skeleton';

interface AddUserModalProps {
    onSubmit: (user: User) => void;
    buttonText?: React.ReactNode;
    roles: Role[];
    isLoading: boolean
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    onSubmit,
    buttonText = 'Add User',
    roles,
    isLoading
}) => {
    // #region STATE
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userRoles, setUserRoles] = useState<DropdownValue>([]);
    // #endregion

    // #region HANDLERS
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setUserRoles([]);
    };

    const handleSubmit = () => {
        if (name.trim() && email.trim()) {
            onSubmit({ name, email, password, roles: userRoles } as unknown as User);
            handleClose();
        }
    };
    // #endregion

    return (
        <>
            <Button variant="primary" onClick={handleOpen} size='sm'>
                {buttonText}
            </Button>

            {isOpen && (
                <Modal
                    title="Add New User"
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
                        <div>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                }}
                                placeholder="jane@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                }}
                                placeholder="Secure password"
                            />
                        </div>

                        <label>
                            Roles:
                            {isLoading ? (
                                <Skeleton className='w-full h-10 mt-2' />
                            ) : (
                                <Select
                                isMulti
                                value={userRoles as string[]}
                                // @ts-ignore
                                onChange={data => setUserRoles(data)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                }}
                                // @ts-ignore
                                options={
                                    roles?.map((p: Role) => ({
                                        label: p.name,
                                        value: p.id,
                                    }))
                                }
                            />)}
                        </label>
                    </div>
                </Modal>
            )}
        </>
    );
};
