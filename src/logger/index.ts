import winston from 'winston'
import { env } from '../config'

const isProd = env.nodeEnv === 'production'

const logger = winston.createLogger({
  level: env.logLevel,
  format: isProd
    ? winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    : winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const rest = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          return `${timestamp} [${level}]: ${message} ${rest}`
        })
      ),
  defaultMeta: isProd ? { service: 'backend-api' } : {},
  transports: isProd
    ? [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error'
        }),
        new winston.transports.File({ filename: 'logs/combined.log' })
      ]
    : [new winston.transports.Console()]
})

export default logger
