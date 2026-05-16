import type { IErrorDetail } from '@/types'

export type ConflictField = 'username' | 'email'

export const authInvalidError = (): IErrorDetail[] => [
  { field: 'email', message: 'Invalid email or password' },
  { field: 'password', message: 'Invalid email or password' }
]

export const authConflictError = (fields: ConflictField[]): IErrorDetail[] => {
  return fields.map((field) => ({
    field,
    message:
      field === 'username'
        ? 'An account with this username already exists'
        : 'An account with this email already exists'
  }))
}
