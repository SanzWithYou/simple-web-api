import type { ApiResponse, IErrorDetail } from '../types'

export function successResponse<T>(message: string, data: T): ApiResponse<T>
export function successResponse(message: string): ApiResponse
export function successResponse<T>(message: string, data?: T): ApiResponse<T> {
  return data !== undefined ? { status: 'success', message, data } : { status: 'success', message }
}

export function errorResponse(message: string, errors?: IErrorDetail[]): ApiResponse {
  return errors && errors.length > 0
    ? { status: 'error', message, errors }
    : { status: 'error', message }
}
