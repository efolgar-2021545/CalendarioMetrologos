import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { corsOptions } from './cors-configuration.js'
import salidasRoutes from '../src/salidas/salida.routes.js'
import actividadesRoutes from '../src/actividades/actividad.routes.js'
import notificacionesRoutes from '../src/notificaciones/notificacion.routes.js'
import historialRoutes from '../src/historial/historial.routes.js'
import recordatoriosRoutes from '../src/recordatorios/recordatorio.routes.js'

export const createApp = () => {
    const app = express()

    app.use(express.json())
    app.use(cors(corsOptions))
    app.use(helmet())
    app.use(morgan('dev'))

    app.use('/api/salidas', salidasRoutes)
    app.use('/api/actividades', actividadesRoutes)
    app.use('/api/notificaciones', notificacionesRoutes)
    app.use('/api/historial', historialRoutes)
    app.use('/api/recordatorios', recordatoriosRoutes)

    return app
}