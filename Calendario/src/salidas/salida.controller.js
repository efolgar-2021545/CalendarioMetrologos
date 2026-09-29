import * as salidaService from './salida.service.js'

export const createSalida = async (req, res) => {
    try {
        const salida = await salidaService.createSalida(req.body, req.user.uid)
        return res.status(201).json({
            success: true,
            salida
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getSalidas = async (req, res) => {
    try {
        const { desde, hasta, metrologo } = req.query
        const salidas = await salidaService.getSalidas({ desde, hasta, metrologo })
        return res.json({
            success: true,
            salidas
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getSalidaById = async (req, res) => {
    try {
        const salida = await salidaService.getSalidaById(req.params.id)
        return res.json({
            success: true,
            salida
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

export const updateSalida = async (req, res) => {
    try {
        const salida = await salidaService.updateSalida(req.params.id, req.body)
        return res.json({
            success: true,
            salida
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteSalida = async (req, res) => {
    try {
        const result = await salidaService.deleteSalida(req.params.id)
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