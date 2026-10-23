import Actividad from './actividad.model.js'
import { validarDisponibilidadGlobal } from '../shared/disponibilidad.js'
import { obtenerMetrologoActivo } from '../shared/directorio.js'

export const createActividad = async (data, adminId) => {
    const { fecha, cliente, metrologoId, hora, ois, observaciones } = data

    const metrologo = await obtenerMetrologoActivo(metrologoId)

    await validarDisponibilidadGlobal(metrologo, fecha)

    const actividad = await Actividad.create({
        fecha,
        cliente,
        metrologoId: metrologo.id,
        metrologo: metrologo.name,
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

    if (filtros.metrologoId) {
        query.metrologoId = filtros.metrologoId
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

    let metrologo = { id: actividad.metrologoId, name: actividad.metrologo }
    const cambioMetrologo = Boolean(data.metrologoId) && data.metrologoId !== actividad.metrologoId

    if (cambioMetrologo) {
        metrologo = await obtenerMetrologoActivo(data.metrologoId)
    }

    const nuevaFecha = data.fecha ?? actividad.fecha

    if (cambioMetrologo || data.fecha) {
        await validarDisponibilidadGlobal(metrologo, nuevaFecha, id, 'Actividad')
    }

    const actualizada = await Actividad.findByIdAndUpdate(
        id,
        {
            fecha: nuevaFecha,
            cliente: data.cliente ?? actividad.cliente,
            metrologoId: metrologo.id,
            metrologo: metrologo.name,
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