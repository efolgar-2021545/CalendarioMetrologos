import { Router } from 'express'
import {
    createSalida,
    getSalidas,
    getSalidaById,
    updateSalida,
    deleteSalida
} from './salida.controller.js'

import { verifyToken } from '../../middlewares/user.comprobated.js'
import { validateRole } from '../../middlewares/validate-role.js'

const router = Router()

// Cualquier usuario logueado (Admin o metrólogo) puede ver las salidas
router.get('/', verifyToken, getSalidas)
router.get('/:id', verifyToken, getSalidaById)

// Solo el Admin puede agregar, editar y eliminar
router.post('/', verifyToken, validateRole('ADMIN'), createSalida)
router.put('/:id', verifyToken, validateRole('ADMIN'), updateSalida)
router.delete('/:id', verifyToken, validateRole('ADMIN'), deleteSalida)

export default router