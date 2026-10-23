import { Router } from 'express'
import { validateInternalKey } from '../../middlewares/validate-internal-key.js'
import { getDirectorio } from '../users/users.controller.js'

const router = Router()

// Solo el servicio Calendario (con la clave compartida) puede consultar esto
router.get('/directorio', validateInternalKey, getDirectorio)

export default router