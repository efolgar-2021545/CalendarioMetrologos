import * as notificacionService from './notificacion.service.js'

export const notificarSalida = async (req, res) => {
    try {
        const result = await notificacionService.notificarSalida(req.params.id)
        return res.json({
            success: true,
            ...result
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const notificarActividad = async (req, res) => {
    try {
        const result = await notificacionService.notificarActividad(req.params.id)
        return res.json({
            success: true,
            ...result
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}