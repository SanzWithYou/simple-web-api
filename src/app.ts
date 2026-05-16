import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config'
import { bodyValidationMiddleware, globalErrorMiddleware, notFoundMiddleware } from './middlewares'
import { registerRoutes } from './routes'

export const createApp = async () => {
  const app = express()

  app.use(helmet())
  app.use(express.json())
  app.use(
    cors({
      origin: env.cors.origin === '*' ? true : env.cors.origin.split(','),
      methods: env.cors.methods,
      credentials: true
    })
  )
  app.use(bodyValidationMiddleware)

  await registerRoutes(app)

  app.use(notFoundMiddleware)
  app.use(globalErrorMiddleware)

  return app
}
