import 'express'
import type { ITokenPayload } from './index'

declare module 'express' {
  interface Request {
    user?: ITokenPayload
  }
}
