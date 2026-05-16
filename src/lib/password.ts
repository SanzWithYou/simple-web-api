import * as argon2 from 'argon2'
import logger from '@/logger'

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(password)

    return hashedPassword
  } catch (error) {
    logger.error(error)
    throw error
  }
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    const isMatched = await argon2.verify(hashedPassword, password)

    return isMatched
  } catch (error) {
    logger.error(error)
    throw error
  }
}
