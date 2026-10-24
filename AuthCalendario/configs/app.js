import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { corsOptions } from './cors-configuration.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/users/users.routes.js'
import internalRoutes from '../src/internal/internal.routes.js'

export const createApp = () => {
    const app = express()

    // En la nube las peticiones llegan a través de un proxy
    app.set('trust proxy', 1)

    app.use(express.json())
    app.use(cors(corsOptions))
    app.use(helmet())
    app.use(morgan('dev'))

    // Sirve para despertar el servidor y comprobar que está vivo
    app.get('/api/health', (req, res) => res.json({ ok: true }))

    app.use('/api/auth', authRoutes)
    app.use('/api/users', userRoutes)
    app.use('/api/internal', internalRoutes)

    return app
}