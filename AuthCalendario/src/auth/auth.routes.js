import { Router } from 'express'
import { login } from './auth.controller.js'
import { validateJWT } from '../../middlewares/validate-jwt.js'

const router = Router()

router.post('/login', login)

// Ruta para probar que el token funciona y ver el usuario logueado
router.get('/profile', validateJWT, (req, res) => {
    res.json({
        message: 'Acceso permitido',
        user: req.user
    })
})

export default router