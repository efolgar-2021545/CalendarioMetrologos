import * as historialService from './historial.service.js'

export const resumenAnual = async (req, res) => {
    try {
        // Si no mandan año, usamos el año actual
        const anio = parseInt(req.query.anio) || new Date().getFullYear()

        const resumen = await historialService.getResumenAnual(anio)
        return res.json({
            success: true,
            resumen
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const detalleMes = async (req, res) => {
    try {
        const anio = parseInt(req.query.anio) || new Date().getFullYear()
        const mes = parseInt(req.query.mes)

        if (!mes || mes < 1 || mes > 12) {
            return res.status(400).json({
                success: false,
                message: 'Debes indicar un mes válido entre 1 y 12'
            })
        }

        const detalle = await historialService.getDetalleMes(anio, mes)
        return res.json({
            success: true,
            detalle
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}