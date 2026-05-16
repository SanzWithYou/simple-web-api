import { createApp } from './app'
import { env } from './config'
import { client } from './database/client'
import logger from './logger'

const startDatabase = async () => {
  try {
    logger.info('connecting to database')

    await client.$connect()

    logger.info('database connected')
  } catch (error) {
    logger.error('failed to connect database', { error })
    process.exit(1)
  }
}

const start = async () => {
  try {
    logger.info('starting server...')

    await startDatabase()

    const app = await createApp()

    const server = app.listen(env.port, () => {
      logger.info(`server running on port ${env.port} [${env.nodeEnv}]`)
    })

    const shutdown = async (signal: string) => {
      logger.info(`received ${signal}, shutting down...`)

      server.close(async () => {
        try {
          await client.$disconnect()
          logger.info('database disconnected')
        } catch (error) {
          logger.error('failed to disconnect database', { error })
        }

        logger.info('server closed gracefully')

        process.exit(0)
      })
    }

    process.on('SIGTERM', () => void shutdown('SIGTERM'))
    process.on('SIGINT', () => void shutdown('SIGINT'))

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('unhandled rejection', { reason })
    })

    process.on('uncaughtException', (error: Error) => {
      logger.error('uncaught exception', { error })
      process.exit(1)
    })
  } catch (error) {
    logger.error('failed to start server', { error })
    process.exit(1)
  }
}

void start()
