'use client'

import React, { useEffect } from 'react'
import {
    useForm,
    FormProvider,
    SubmitHandler,
    FieldValues,
    useWatch,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'

interface FormProps<T extends FieldValues> {
    schema: ZodType<T>
    onSubmit: SubmitHandler<T>
    children: React.ReactNode
    className?: string
    submitOnChange?: boolean
    autoSubmitDelay?: number // debounce delay in ms
}

export function Form<T extends FieldValues>({
    schema,
    onSubmit,
    children,
    className,
    submitOnChange = false,
    autoSubmitDelay = 300,
}: FormProps<T>) {
    const methods = useForm<T>({
        resolver: zodResolver(schema),
        mode: 'onTouched', // delay validation until field is touched
        reValidateMode: 'onChange', // then validate as it changes
    })

    const { handleSubmit, control } = methods

    const values = useWatch({ control })

    useEffect(() => {
        if (submitOnChange) {
            const timeout = setTimeout(() => {
                handleSubmit(onSubmit)()
            }, autoSubmitDelay)

            return () => clearTimeout(timeout)
        }
    }, [values, handleSubmit, onSubmit, submitOnChange, autoSubmitDelay])

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={className}>
                {children}
            </form>
        </FormProvider>
    )
}
