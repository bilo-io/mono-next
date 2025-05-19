/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

export type FilterField = {
    name: string;
    type: 'text' | 'email' | 'date' | 'select';
    label: string;
    placeholder?: string;
    options?: { value: string; label: string }[]; // Options for 'select' fields
};

interface FilterFormProps {
    onChange: (query: any) => void; // Function to update query state
    initialValues?: any; // Initial values for the form
    fields: FilterField[]; // Array of filter fields
}

export const FilterForm: React.FC<FilterFormProps> = ({
    onChange,
    initialValues = {},
    fields,
}) => {
    const { control, handleSubmit, watch } = useForm({
        defaultValues: initialValues,
    });

    const watchFields = watch();

    const onSubmit = (data: any) => {
        onChange(data);
    };

    React.useEffect(() => {
        onChange(watchFields);
    }, [watchFields, onChange]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-wrap space-x-2">
            {fields.map((field) => {
                return (
                    <div key={field.name}>
                        <label
                            htmlFor={field.name}
                            className="block text-sm font-medium text-gray-700"
                        >
                            {field.label}
                        </label>
                        <div className=''>
                            <Controller
                                name={field.name}
                                control={control}
                                className={''}
                                render={({ field: controllerField }) => {
                                    switch (field.type) {
                                        case 'text':
                                        case 'email':
                                            return (
                                                <input
                                                    {...controllerField}
                                                    type={field.type}
                                                    id={field.name}
                                                    placeholder={field.placeholder}
                                                    className="mt-1 p-2 border rounded-md w-full"
                                                />
                                            );
                                        case 'date':
                                            return (
                                                <input
                                                    {...controllerField}
                                                    type="date"
                                                    id={field.name}
                                                    className="mt-1 p-2 border rounded-md w-full"
                                                />
                                            );
                                        case 'select':
                                            return (
                                                <select
                                                    {...controllerField}
                                                    id={field.name}
                                                    className="mt-1 p-2 border rounded-md w-full"
                                                >
                                                    {field.options?.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            );
                                        default:
                                            return null;
                                    }
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            <div className="flex justify-end">
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
                    Apply Filters
                </button>
            </div>
        </form>
    );
};
