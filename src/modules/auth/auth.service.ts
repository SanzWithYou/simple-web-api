import * as crypto from 'crypto'
import { AppError, comparePassword, hashPassword, signAccessToken, signRefreshToken } from '@/lib'
import { userRepository } from '@/repository/user.repository'
import type { ITokenPayload } from '@/types'
import { authConflictError, authInvalidError, ConflictField } from './auth.errors'
import {
  LoginPayload,
  LoginResponse,
  MeResponse,
  RegisterPayload,
  RegisterResponse
} from './auth.type'

export const authService = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { username, email, password } = payload

    const errors: ConflictField[] = []

    const usernameExists = await userRepository.findByUsername(username)

    if (usernameExists) {
      errors.push('username')
    }

    const emailExists = await userRepository.findByEmail(email)

    if (emailExists) {
      errors.push('email')
    }

    if (errors.length > 0) {
      throw new AppError(409, 'Some account details are already in use', authConflictError(errors))
    }

    const hashedPassword = await hashPassword(password)

    const user = await userRepository.create({
      username,
      email,
      password: hashedPassword
    })

    return {
      status: 'success',
      message: 'Your account has been created successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { email, password } = payload

    const errors = authInvalidError()

    const user = await userRepository.findByEmail(email)

    if (!user) {
      throw new AppError(401, 'Authentication failed. Invalid credentials', errors)
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
      throw new AppError(401, 'Authentication failed. Invalid credentials', errors)
    }

    const accessToken = await signAccessToken({
      username: user.username,
      email: user.email,
      jti: crypto.randomUUID()
    })

    const refreshToken = await signRefreshToken({
      username: user.username,
      email: user.email,
      jti: crypto.randomUUID()
    })

    return {
      status: 'success',
      message: 'You have been logged in successfully',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken
      }
    }
  },

  me: async (tokenPayload: ITokenPayload): Promise<MeResponse> => {
    const user = await userRepository.findByEmail(tokenPayload.email)

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return {
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }
  }
}
