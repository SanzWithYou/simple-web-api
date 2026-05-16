import type { NextFunction, Request, Response } from 'express'
import { env } from '../config'
import { AppError } from '../lib'
import logger from '../logger'

export const bodyValidationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.body) {
      logger.warn('Empty request body received', {
        method: req.method,
        path: req.path,
        ip: req.ip
      })

      throw new AppError(400, 'Request body cannot be empty')
    }

    if (env.nodeEnv === 'development') {
      logger.debug('Request body received', {
        method: req.method,
        path: req.path,
        body: req.body,
        ip: req.ip
      })
    }
  }

  next()
}
