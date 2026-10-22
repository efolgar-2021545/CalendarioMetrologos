import { Router } from 'express'
import { notificarSalida, notificarActividad } from './notificacion.controller.js'
import { verifyToken } from '../../middlewares/user.comprobated.js'
import { validateRole } from '../../middlewares/validate-role.js'

const router = Router()

router.post('/salida/:id', verifyToken, validateRole('ADMIN'), notificarSalida)
router.post('/actividad/:id', verifyToken, validateRole('ADMIN'), notificarActividad)

export default router