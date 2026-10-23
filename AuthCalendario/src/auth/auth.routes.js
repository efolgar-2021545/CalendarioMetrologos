import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { register, login } from './auth.controller.js'
import { validateJWT } from '../../middlewares/validate-jwt.js'

const router = Router()

// El registro es público: limitamos los intentos por IP para evitar spam
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Demasiados intentos de registro. Intenta de nuevo más tarde.' }
})

router.post('/register', registerLimiter, register)
router.post('/login', login)

// Ruta para probar que el token funciona y ver el usuario logueado
router.get('/profile', validateJWT, (req, res) => {
    res.json({
        message: 'Acceso permitido',
        user: req.user
    })
})

export default router