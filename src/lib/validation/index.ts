import { z } from 'zod'

export const RegisterValidation = z.object({
    name: z.string().min(2, { message: 'Too Short' }),
    username: z.string().min(2, { message: 'Too Short' }),
    email: z.string().email(),
    password: z.string().min(5, {
        message: 'Password must be at least 5 characters',
    }),
})
