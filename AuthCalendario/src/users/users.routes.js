import { Router } from 'express'
import { validateJWT } from '../../middlewares/validate-jwt.js'
import { validateRole } from '../../middlewares/validate-role.js'
import {
    listMetrologos,
    getMetrologo,
    editMetrologo,
    toggleMetrologoStatus
} from './users.controller.js'

const router = Router()

// Todas las rutas requieren estar logueado y ser ADMIN
router.get('/metrologos', validateJWT, validateRole('ADMIN'), listMetrologos)
router.get('/metrologos/:id', validateJWT, validateRole('ADMIN'), getMetrologo)
router.put('/metrologos/:id', validateJWT, validateRole('ADMIN'), editMetrologo)
router.patch('/metrologos/:id/status', validateJWT, validateRole('ADMIN'), toggleMetrologoStatus)

export default router