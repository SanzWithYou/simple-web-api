import { client } from '@/database/client'

interface CreateUserData {
  username: string
  email: string
  password: string
}

export const userRepository = {
  findById: (id: string) =>
    client.user.findUnique({
      where: { id }
    }),

  findByEmail: (email: string) =>
    client.user.findUnique({
      where: { email }
    }),

  findByUsername: (username: string) =>
    client.user.findUnique({
      where: { username }
    }),

  create: (data: CreateUserData) =>
    client.user.create({
      data
    })
}
