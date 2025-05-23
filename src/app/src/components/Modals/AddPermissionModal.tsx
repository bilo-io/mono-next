// components/modals/AddPermissionModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Permission } from '@/app/security/page';


interface AddPermissionModalProps {
    onSubmit: (permission: Permission) => void;
    buttonText?: React.ReactNode;
}

export const AddPermissionModal: React.FC<AddPermissionModalProps> = ({
    onSubmit,
    buttonText = 'Add Permission',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setName('');
    };

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit({ name } as Permission);
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
                    title="Add New Permission"
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
                    </div>
                </Modal>
            )}
        </>
    );
};
