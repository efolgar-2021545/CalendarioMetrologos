import { Router } from 'express'
import { validateJWT } from '../../middlewares/validate-jwt.js'
import { validateRole } from '../../middlewares/validate-role.js'
import {
    listMetrologos,
    getMetrologo,
    editMetrologo,
    toggleMetrologoStatus,
    updateMyPassword
} from './users.controller.js'

const router = Router()

// Control de metrólogos: solo ADMIN
router.get('/metrologos', validateJWT, validateRole('ADMIN'), listMetrologos)
router.get('/metrologos/:id', validateJWT, validateRole('ADMIN'), getMetrologo)
router.put('/metrologos/:id', validateJWT, validateRole('ADMIN'), editMetrologo)
router.patch('/metrologos/:id/status', validateJWT, validateRole('ADMIN'), toggleMetrologoStatus)

// Cambiar la propia contraseña: cualquier usuario logueado
router.patch('/change-password', validateJWT, validateRole('ADMIN', 'USUARIO'), updateMyPassword)

export default router