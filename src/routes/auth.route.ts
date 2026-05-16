import { Router } from 'express'
import { authenticate, validate } from '@/middlewares'
import { authController, authValidation } from '@/modules/auth'

const router = Router()

router.post('/register', validate(authValidation.register), authController.register)
router.post('/login', validate(authValidation.login), authController.login)
router.get('/me', authenticate, authController.me)

export default router
