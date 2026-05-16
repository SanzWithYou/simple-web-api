import { Request, Response, Router } from 'express'
import { env } from '../config'
import { successResponse } from '../lib'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  res.json(
    successResponse('Server is running', {
      environment: env.nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    })
  )
})

export default router
