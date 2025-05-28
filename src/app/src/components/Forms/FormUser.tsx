// components/Forms/FormUser.tsx
import React from 'react'
import { z } from 'zod'
import { Form } from '../ui/Form'
import { FormField } from '../ui/FormField'
import { Role } from '../Views/Security/RolesView'

const schema = z.object({
    name: z.string().min(2, 'Minimum 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Minimum 6 characters'),
    // Change roles to be an array of strings (the role IDs)
    roles: z.array(z.string()),
})

export type FormDataUser = z.infer<typeof schema>

export default function FormUser({ onSubmit, roles }: { roles: Role[], onSubmit: (data: FormDataUser) => void }) {
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
                    name="email"
                    label="Email"
                    type="text"
                    placeholder="john@doe.com"
                    className="col-span-12"
                />
                <FormField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder=""
                    className="col-span-12"
                />
                <FormField
                    name="roles"
                    label="Roles"
                    type="multi-select"
                    options={roles?.map?.((role: Role) => ({
                        label: role.name,
                        value: role.id
                    }))}
                    placeholder="'read:users', 'write:users', etc."
                    className="col-span-12"
                />
            </div>
        </Form>
    )
}