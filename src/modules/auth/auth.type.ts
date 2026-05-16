import { ApiResponse } from '@/types'

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export type RegisterResponse = ApiResponse

export interface LoginPayload {
  email: string
  password: string
}

export interface Token {
  access_token: string
  refresh_token: string
}

export type LoginResponse = ApiResponse<Token>

export interface MeData {
  id: string
  username: string
  email: string
}

export type MeResponse = ApiResponse<MeData>
