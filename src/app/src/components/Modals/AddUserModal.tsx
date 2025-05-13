// components/modals/AddUserModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface AddUserModalProps {
    onAddUser: (user: { name: string; email: string }) => void;
    buttonText?: string;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    onAddUser,
    buttonText = 'Add User',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setName('');
        setEmail('');
    };

    const handleSubmit = () => {
        if (name.trim() && email.trim()) {
            onAddUser({ name, email });
            handleClose();
        }
    };

    return (
        <>
            <Button variant="primary" size="md" onClick={handleOpen}>
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
                    </div>
                </Modal>
            )}
        </>
    );
};
