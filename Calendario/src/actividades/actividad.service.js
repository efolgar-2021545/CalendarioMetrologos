import Actividad from './actividad.model.js'
import { validarDisponibilidadGlobal } from '../shared/disponibilidad.js'

export const createActividad = async (data, adminId) => {
    const { fecha, cliente, metrologo, hora, ois, observaciones } = data

    await validarDisponibilidadGlobal(metrologo, fecha)

    const actividad = await Actividad.create({
        fecha,
        cliente,
        metrologo,
        hora,
        ois,
        observaciones,
        creadoPor: adminId
    })

    return actividad
}

export const getActividades = async (filtros = {}) => {
    const query = {}

    if (filtros.desde && filtros.hasta) {
        query.fecha = { $gte: new Date(filtros.desde), $lte: new Date(filtros.hasta) }
    }

    if (filtros.metrologo) {
        query.metrologo = filtros.metrologo
    }

    const actividades = await Actividad.find(query).sort({ fecha: 1, hora: 1 })
    return actividades
}

export const getActividadById = async (id) => {
    const actividad = await Actividad.findById(id)
    if (!actividad) throw new Error('Actividad no encontrada')
    return actividad
}

export const updateActividad = async (id, data) => {
    const actividad = await Actividad.findById(id)
    if (!actividad) throw new Error('Actividad no encontrada')

    const nuevoMetrologo = data.metrologo ?? actividad.metrologo
    const nuevaFecha = data.fecha ?? actividad.fecha

    if (data.metrologo || data.fecha) {
        await validarDisponibilidadGlobal(nuevoMetrologo, nuevaFecha, id, 'Actividad')
    }

    const actualizada = await Actividad.findByIdAndUpdate(
        id,
        {
            fecha: nuevaFecha,
            cliente: data.cliente ?? actividad.cliente,
            metrologo: nuevoMetrologo,
            hora: data.hora ?? actividad.hora,
            ois: data.ois ?? actividad.ois,
            observaciones: data.observaciones ?? actividad.observaciones
        },
        { new: true }
    )

    return actualizada
}

export const deleteActividad = async (id) => {
    const actividad = await Actividad.findById(id)
    if (!actividad) throw new Error('Actividad no encontrada')

    await actividad.deleteOne()

    return { message: 'Actividad eliminada correctamente' }
}