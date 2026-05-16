import crypto from 'crypto'
import { V4 } from 'paseto'
import { env } from '../config'
import type { ITokenPayload } from '../types'
import { AppError } from './errors'

const sign = async (
  payload: ITokenPayload,
  secretKey: string,
  type: 'access' | 'refresh',
  expiresIn: string,
  kid: string
): Promise<string> => {
  return V4.sign({ ...payload, type }, secretKey, {
    assertion: 'internal-api',
    audience: 'full-stack-app',
    expiresIn,
    footer: { env: env.nodeEnv, version: '1.0.0' },
    iat: true,
    issuer: 'full-stack-backend',
    jti: payload.jti,
    kid,
    notBefore: '0s',
    now: new Date(),
    subject: payload.email
  })
}

export const signAccessToken = (payload: ITokenPayload) =>
  sign(payload, env.accessTokenSecretKey, 'access', '15m', 'access-token-key')

export const signRefreshToken = (payload: ITokenPayload) =>
  sign(payload, env.refreshTokenSecretKey, 'refresh', '7d', 'refresh-token-key')

const verify = async (
  token: string,
  publicKey: string,
  expectedType: 'access' | 'refresh',
  label: string
): Promise<ITokenPayload> => {
  if (!token || typeof token !== 'string') {
    throw new AppError(401, `${label} is required.`)
  }

  if (!token.startsWith('v4.public.')) {
    throw new AppError(401, `Invalid ${label.toLowerCase()} format.`)
  }

  try {
    const decoded = await V4.verify(token, publicKey, {
      assertion: 'internal-api'
    })

    if (!decoded) {
      throw new AppError(401, `Failed to decode ${label.toLowerCase()}.`)
    }

    if (decoded.type !== expectedType) {
      throw new AppError(401, `Invalid token type. Expected ${expectedType} token.`)
    }

    if (expectedType === 'access') {
      const requiredFields = ['email', 'username', 'role', 'type']
      const missingFields = requiredFields.filter((field) => !decoded[field])
      if (missingFields.length > 0) {
        throw new AppError(401, `Token is missing required fields: ${missingFields.join(', ')}`)
      }
    }

    return decoded as unknown as ITokenPayload
  } catch (error) {
    if (error instanceof AppError) throw error

    const msg = error instanceof Error ? error.message.toLowerCase() : ''

    if (msg.includes('expired')) {
      throw new AppError(401, `${label} expired. Please login again.`)
    }

    if (msg.includes('signature')) {
      throw new AppError(401, `Invalid ${label.toLowerCase()} signature.`)
    }

    if (msg.includes('assertion')) {
      throw new AppError(401, 'Token assertion validation failed.')
    }

    throw new AppError(401, `Invalid ${label.toLowerCase()}.`)
  }
}

export const verifyAccessToken = (token: string) =>
  verify(token, env.accessTokenPublicKey, 'access', 'Access token')

export const verifyRefreshToken = (token: string) =>
  verify(token, env.refreshTokenPublicKey, 'refresh', 'Refresh token')

export const hashToken = (token: string) =>
  crypto.createHmac('sha256', env.refreshTokenSecretKey).update(token).digest('base64')

export const compareToken = (token: string, hashedToken: string) => {
  const hashedInput = hashToken(token)
  return crypto.timingSafeEqual(
    Buffer.from(hashedInput, 'base64'),
    Buffer.from(hashedToken, 'base64')
  )
}
