/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import clsx from 'clsx'
import { useTheme } from '@/context/ThemeContext'
import { Select } from './Select' // Import the custom Select component
import { SingleValue, MultiValue } from 'react-select' // Import these types from react-select

interface FormFieldProps {
    name: string
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multi-select' | 'date' | 'datetime-local' | 'time'
    options?: { label: string | undefined; value: string | number | null }[]
    placeholder?: string
    className?: string
}

export function FormField({
    name,
    label,
    options,
    className,
    type = 'text',
    placeholder = '',
}: FormFieldProps) {
    const { theme } = useTheme();
    const {
        control,
        formState: { errors, touchedFields },
        setValue,
    } = useFormContext()

    const isTouched = touchedFields[name]
    const error = isTouched ? (errors[name]?.message as string | undefined) : undefined

    const baseClasses =
        `peer w-full rounded-md border border-black/10 bg-white px-3 pt-5 pb-2 text-sm text-black placeholder-transparent transition focus:border-[${theme.PRIMARY}] focus:outline-none focus:ring-2 focus:ring-[${theme.PRIMARY}]`

    const labelClasses =
        `absolute left-2 top-2 z-10 origin-[0] scale-75 transform px-1 bg-white text-xs text-gray-500 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:scale-75 peer-focus:text-[${theme.PRIMARY}]`

    const wrapperClasses = clsx(
        'relative flex flex-col mb-4',
        className || 'col-span-12'
    )

    const renderLabel = () =>
        label && (
            <label htmlFor={name} className={labelClasses}>
                {label}
            </label>
        )

    if (type === 'select' || type === 'multi-select') {
        // Map FormField's options to the format expected by your custom Select component
        const mappedOptions = options?.map(opt => ({
            label: opt.label || String(opt.value), // Ensure label is string, default to value if undefined
            value: String(opt.value) // Ensure value is string
        })) || [];

        return (
            <div className={wrapperClasses}>
                {renderLabel()}
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <Select
                            id={name}
                            options={mappedOptions} // Use the mapped options
                            // For single select, field.value could be string, number, or null
                            // For multi-select, field.value could be string[] or number[]
                            // We need to ensure the `value` prop passed to ReactSelect (via your custom Select)
                            // matches what ReactSelect expects.
                            // ReactSelect expects: SingleValue<{ value: string; label: string; }> | MultiValue<{ value: string; label: string; }>
                            // Convert current field.value to the format expected by ReactSelect
                            // @ts-ignore
                            value={
                                type === 'multi-select'
                                    ? (field.value as (string | number)[])?.map(val => mappedOptions.find(opt => opt.value === String(val)))
                                    : mappedOptions.find(opt => opt.value === String(field.value))
                            }
                            isMulti={type === 'multi-select'}
                            onChange={(newValue) => {
                                if (type === 'multi-select') {
                                    // @ts-ignore
                                    const selectedOptions = newValue as MultiValue<{ value: string; label: string; }>;
                                    const selectedValues = selectedOptions.map(option => option.value);
                                    setValue(name, selectedValues, { shouldValidate: true, shouldDirty: true });
                                } else {
                                    const selectedOption = newValue as SingleValue<{ value: string; label: string; }>;
                                    setValue(name, selectedOption?.value, { shouldValidate: true, shouldDirty: true });
                                }
                            }}
                            placeholder={placeholder}
                        />
                    )}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        )
    }

    if (type === 'textarea') {
        return (
            <div className={wrapperClasses}>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <>
                            {renderLabel()}
                            <textarea
                                {...field}
                                id={name}
                                rows={4}
                                placeholder={placeholder}
                                className={baseClasses}
                            />
                        </>
                    )}
                />
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
        )
    }

    // default input (text, email, password, number, date, datetime-local, time)
    return (
        <div className={wrapperClasses}>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <>
                        {renderLabel()}
                        <input
                            {...field}
                            id={name}
                            type={type}
                            placeholder={placeholder}
                            className={baseClasses}
                        />
                    </>
                )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    )
}