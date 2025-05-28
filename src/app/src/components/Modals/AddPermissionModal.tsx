// components/modals/AddPermissionModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Permission } from '@/app/security/page';
import FormPermission, { FormDataPermission } from '../Forms/FormPermission';


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
                    <FormPermission
                        onSubmit={(data: FormDataPermission): void => {
                            setName(data.name)
                        }}
                    />
                </Modal>
            )}
        </>
    );
};
