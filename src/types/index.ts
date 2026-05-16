export interface IErrorDetail {
  field?: string
  message: string
}

export interface ITokenPayload {
  email: string
  username: string
  role: string
  jti: string
  type: 'access' | 'refresh'
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error'
  message: string
  data?: T
  errors?: IErrorDetail[]
}
