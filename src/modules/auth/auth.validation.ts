import z from 'zod'

export const authValidation = {
  register: z.object({
    username: z
      .string({ message: 'Please enter a username' })
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores'
      }),

    email: z.email('Please enter a valid email address'),

    password: z
      .string({ message: 'Please enter a password' })
      .min(8, 'Password must be at least 8 characters')
  }),

  login: z.object({
    email: z.email('Please enter a valid email address'),

    password: z
      .string({ message: 'Please enter a password' })
      .min(8, 'Password must be at least 8 characters')
  })
}
