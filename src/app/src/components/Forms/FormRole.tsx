// components/Forms/FormUser.tsx
import React from 'react'
import { z } from 'zod'
import { Form } from '../ui/Form'
import { FormField } from '../ui/FormField'
import { Permission } from '@/app/security/page'

const schema = z.object({
    name: z.string().min(2, 'Minimum 2 characters'),
    // Change roles to be an array of strings (the role IDs)
    permissions: z.array(z.string()),
})

export type FormDataUser = z.infer<typeof schema>

export default function FormRole({ onSubmit, permissions }: { permissions: Permission[], onSubmit: (data: FormDataUser) => void }) {
    return (
        <Form schema={schema} onSubmit={onSubmit} submitOnChange autoSubmitDelay={500}>
            <div className="grid grid-cols-12 gap-4 m-1">
                <FormField
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="John Doe"
                    className="col-span-12"
                />
                <FormField
                    name="permissions"
                    label="Permissions"
                    type="multi-select"
                    options={permissions?.map?.((permission: Permission) => ({
                        label: permission.name,
                        value: permission.id
                    }))}
                    placeholder="'read:users', 'write:users', etc."
                    className="col-span-12"
                />
            </div>
        </Form>
    )
}