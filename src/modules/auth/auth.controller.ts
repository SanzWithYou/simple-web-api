import type { Request, Response } from 'express'
import { asyncHandler, successResponse } from '@/lib'
import { authService } from './auth.service'

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const results = await authService.register(req.body)

    res.status(201).json(successResponse(results.message, results.data))
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const results = await authService.login(req.body)

    res.status(200).json(successResponse(results.message))
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const results = await authService.me(req.user!)

    res.status(200).json(successResponse(results.message, results.data))
  })
}
