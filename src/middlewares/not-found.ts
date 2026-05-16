import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../lib'

export const notFoundMiddleware = (req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(404, `Route ${req.method} ${req.path} not found`)
}
