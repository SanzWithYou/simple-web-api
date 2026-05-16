import type { IErrorDetail } from '../types'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: IErrorDetail[],
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}
