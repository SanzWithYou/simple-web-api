import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'
import { env } from '../config'
import { AppError } from '../lib'
import logger from '../logger'

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body)

      if (!result.success) {
        if (env.nodeEnv === 'development') {
          logger.debug('Validation error', {
            method: req.method,
            path: req.path,
            issues: result.error.issues
          })
        }

        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'root',
          message: issue.message
        }))

        throw new AppError(400, 'Validation failed', errors)
      }

      req.body = result.data
      next()
    } catch (error) {
      if (error instanceof AppError) throw error
      next(error)
    }
  }
}
