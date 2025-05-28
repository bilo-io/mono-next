'use client'
import React from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import clsx from 'clsx'
import { useTheme } from '@/context/ThemeContext'
// import Select from './Select'

interface FormFieldProps {
    name: string
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'datetime-local' | 'time'
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

    if (type === 'select') {
        return (
            <div className={wrapperClasses}>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <>
                            {renderLabel()}
                            <select
                                {...field}
                                id={name}
                                aria-invalid={!!error}
                                className={clsx(
                                    baseClasses,
                                    'appearance-none pr-8' // Add space for dropdown icon if needed
                                )}
                            >
                                <option value="" disabled hidden>
                                    {placeholder}
                                </option>
                                {options?.map((opt) => (
                                    <option key={opt.value} value={opt.value as string}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </>
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
