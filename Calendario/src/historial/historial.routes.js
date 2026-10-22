import { Router } from 'express'
import { resumenAnual, detalleMes } from './historial.controller.js'
import { verifyToken } from '../../middlewares/user.comprobated.js'
import { validateRole } from '../../middlewares/validate-role.js'

const router = Router()

router.get('/anual', verifyToken, validateRole('ADMIN'), resumenAnual)
router.get('/mes', verifyToken, validateRole('ADMIN'), detalleMes)

export default router