import type { NextFunction, Request, Response } from 'express'
import { AppError, verifyAccessToken } from '../lib'

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError(401, 'Missing or invalid authorization header')
  }

  const token = header.replace('Bearer ', '')
  const payload = await verifyAccessToken(token)

  req.user = payload
  next()
}
