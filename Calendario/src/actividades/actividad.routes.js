import { Router } from 'express'
import {
    createActividad,
    getActividades,
    getActividadById,
    updateActividad,
    deleteActividad
} from './actividad.controller.js'

import { verifyToken } from '../../middlewares/user.comprobated.js'
import { validateRole } from '../../middlewares/validate-role.js'

const router = Router()

// Visible para cualquier usuario logueado (cumple "que sea visible lo que se hace en el lab")
router.get('/', verifyToken, getActividades)
router.get('/:id', verifyToken, getActividadById)

// Solo el Admin agrega, edita y elimina
router.post('/', verifyToken, validateRole('ADMIN'), createActividad)
router.put('/:id', verifyToken, validateRole('ADMIN'), updateActividad)
router.delete('/:id', verifyToken, validateRole('ADMIN'), deleteActividad)

export default router