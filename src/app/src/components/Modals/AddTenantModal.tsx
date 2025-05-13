'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Tenant } from '@/app/tenants/page';

interface AddTenantModalProps {
    onSubmit: (data: Tenant) => void;
    buttonText: string;
}

export const AddTenantModal: React.FC<AddTenantModalProps> = ({ buttonText, onSubmit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = () => {
        onSubmit({ name } as Tenant);
        setName('');
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
        setName('');
    };

    return (
        <>
            <Button variant="primary" onClick={() => setIsOpen(true)} size='sm' className='focus:outline-0'>
                {buttonText}
            </Button>

            {isOpen && (
                <Modal
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    submitText="Create"
                    cancelText="Cancel"
                    title="Add New Tenant"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label>
                            Tenant Name:
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                }}
                            />
                        </label>
                    </div>
                </Modal>
            )}
        </>
    );
};
