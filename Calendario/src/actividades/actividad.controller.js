import * as actividadService from './actividad.service.js'

export const createActividad = async (req, res) => {
    try {
        const actividad = await actividadService.createActividad(req.body, req.user.uid)
        return res.status(201).json({
            success: true,
            actividad
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getActividades = async (req, res) => {
    try {
        const { desde, hasta, metrologo } = req.query
        const actividades = await actividadService.getActividades({ desde, hasta, metrologo })
        return res.json({
            success: true,
            actividades
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getActividadById = async (req, res) => {
    try {
        const actividad = await actividadService.getActividadById(req.params.id)
        return res.json({
            success: true,
            actividad
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

export const updateActividad = async (req, res) => {
    try {
        const actividad = await actividadService.updateActividad(req.params.id, req.body)
        return res.json({
            success: true,
            actividad
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteActividad = async (req, res) => {
    try {
        const result = await actividadService.deleteActividad(req.params.id)
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