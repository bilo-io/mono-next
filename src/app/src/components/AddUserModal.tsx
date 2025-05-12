// components/AddUserModal.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface AddUserForm {
    name: string;
    email: string;
}

export function AddUserModal() {
    const [open, setOpen] = useState(false);
    const { theme } = useTheme()
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddUserForm>();

    const onSubmit = async (data: AddUserForm) => {
        await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        setOpen(false);
        reset();
    };

    return (
        <>
            <button onClick={() => setOpen(true)} className="ml-auto mb-0 px-4 py-2 border rounded-lg text-sm"
            style={{ color: theme.PRIMARY, borderColor: theme.PRIMARY }}>
                + Add
            </button>
            {open && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add User</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label>Name</label>
                                <input
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full border p-2 rounded"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="w-full border p-2 rounded"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
