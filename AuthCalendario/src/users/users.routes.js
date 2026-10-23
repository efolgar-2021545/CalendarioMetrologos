import { Router } from 'express'
import { validateJWT } from '../../middlewares/validate-jwt.js'
import { validateRole } from '../../middlewares/validate-role.js'
import {
    listMetrologos,
    getMetrologo,
    editMetrologo,
    toggleMetrologoStatus,
    listSolicitudes,
    aprobarSolicitud,
    rechazarSolicitud,
    getDirectorio,
    updateMyPassword
} from './users.controller.js'

const router = Router()

// Control de metrólogos: solo ADMIN
router.get('/metrologos', validateJWT, validateRole('ADMIN'), listMetrologos)
router.get('/metrologos/:id', validateJWT, validateRole('ADMIN'), getMetrologo)
router.put('/metrologos/:id', validateJWT, validateRole('ADMIN'), editMetrologo)
router.patch('/metrologos/:id/status', validateJWT, validateRole('ADMIN'), toggleMetrologoStatus)

// Solicitudes de registro: solo ADMIN
router.get('/solicitudes', validateJWT, validateRole('ADMIN'), listSolicitudes)
router.patch('/solicitudes/:id/aprobar', validateJWT, validateRole('ADMIN'), aprobarSolicitud)
router.delete('/solicitudes/:id', validateJWT, validateRole('ADMIN'), rechazarSolicitud)

// Lista de usuarios aprobados (para el formulario de agendar): solo ADMIN
router.get('/directorio', validateJWT, validateRole('ADMIN'), getDirectorio)

// Cambiar la propia contraseña: cualquier usuario logueado
router.patch('/change-password', validateJWT, validateRole('ADMIN', 'USUARIO'), updateMyPassword)

export default router