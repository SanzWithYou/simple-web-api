import type { NextFunction, Request, Response } from 'express'
import { AppError, errorResponse } from '../lib'
import logger from '../logger'

export const globalErrorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500
  let message = 'Internal server error'
  let errors = undefined

  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
    errors = err.errors
  } else if (err instanceof Error) {
    message = err.message
  }

  logger.error(message, {
    statusCode,
    method: req.method,
    path: req.path,
    ip: req.ip,
    errors,
    stack: err.stack
  })

  res.status(statusCode).json(errorResponse(message, errors))
}
