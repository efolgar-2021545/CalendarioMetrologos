import { Router } from 'express'
import { ejecutarManual } from './recordatorio.controller.js'
import { verifyToken } from '../../middlewares/user.comprobated.js'
import { validateRole } from '../../middlewares/validate-role.js'
import { validateInternalKey } from '../../middlewares/validate-internal-key.js'

const router = Router()

// Botón del panel Admin
router.post('/ejecutar', verifyToken, validateRole('ADMIN'), ejecutarManual)

// Lo llama el programador externo (cron-job.org) con la clave interna
router.post('/cron', validateInternalKey, ejecutarManual)

export default router