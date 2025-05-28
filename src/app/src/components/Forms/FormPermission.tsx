import React from 'react'
import { z } from 'zod'
import { Form } from '../ui/Form'
import { FormField } from '../ui/FormField'

const schema = z.object({
    name: z.string().min(2, 'Minimum 2 characters'),
})

export type FormDataPermission = z.infer<typeof schema>

export default function FormPermission({ onSubmit }: { onSubmit: (data: FormDataPermission) => void }) {
    return (
        <Form schema={schema} onSubmit={onSubmit} submitOnChange autoSubmitDelay={500}>
            <div className="grid grid-cols-12 gap-4 m-1">
                <FormField
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Name of permission (e.g. 'read:users')"
                    className="col-span-12"
                />
            </div>
        </Form>

    )
}
