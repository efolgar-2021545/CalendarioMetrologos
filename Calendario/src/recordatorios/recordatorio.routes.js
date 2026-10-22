import { Router } from 'express'
import { ejecutarManual } from './recordatorio.controller.js'
import { verifyToken } from '../../middlewares/user.comprobated.js'
import { validateRole } from '../../middlewares/validate-role.js'

const router = Router()

// Solo el Admin puede disparar los recordatorios manualmente
router.post('/ejecutar', verifyToken, validateRole('ADMIN'), ejecutarManual)

export default router