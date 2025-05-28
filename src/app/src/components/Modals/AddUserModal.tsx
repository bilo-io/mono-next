// components/modals/AddUserModal.tsx
'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { User } from '@/app/users/page';
import { Role } from '../Views/Security/RolesView';
import FormUser, { FormDataUser } from '../Forms/FormUser';

interface AddUserModalProps {
    onSubmit: (user: User) => void;
    buttonText?: React.ReactNode;
    roles: Role[]; // All available roles
    isLoading: boolean
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    onSubmit,
    buttonText = 'Add User',
    roles, // Pass all available roles down
    // isLoading
}) => {
    // #region STATE
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Store userRoles as an array of role IDs (strings)
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    // #endregion

    // #region HANDLERS
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setSelectedRoleIds([]); // Reset role IDs
    };

    const handleSubmit = () => {
        if (name.trim() && email.trim()) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onSubmit({ name, email, password, roleIds: selectedRoleIds } as User);
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
                    <FormUser
                        roles={roles} // Pass the roles prop to FormUser
                        onSubmit={(data: FormDataUser): void => {
                            setName(data.name)
                            setEmail(data.email)
                            setPassword(data.password)
                            // `data.roles` will now be an array of strings (role IDs)
                            setSelectedRoleIds(data.roles)
                        }}
                    />
                </Modal>
            )}
        </>
    );
};