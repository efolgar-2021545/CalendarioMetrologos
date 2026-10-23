import Salida from './salida.model.js'
import { validarDisponibilidadGlobal } from '../shared/disponibilidad.js'
import { obtenerMetrologoActivo } from '../shared/directorio.js'

export const createSalida = async (data, adminId) => {
    const { fecha, cliente, metrologoId, hora, ois, observaciones } = data

    // Confirma con el servicio de usuarios que el metrólogo existe y está activo
    const metrologo = await obtenerMetrologoActivo(metrologoId)

    await validarDisponibilidadGlobal(metrologo, fecha)

    const salida = await Salida.create({
        fecha,
        cliente,
        metrologoId: metrologo.id,
        metrologo: metrologo.name,
        hora,
        ois,
        observaciones,
        creadoPor: adminId
    })

    return salida
}

export const getSalidas = async (filtros = {}) => {
    const query = {}

    // Filtro por rango de fechas (para vista diaria/semanal/mensual)
    if (filtros.desde && filtros.hasta) {
        query.fecha = { $gte: new Date(filtros.desde), $lte: new Date(filtros.hasta) }
    }

    // Filtro opcional por metrólogo
    if (filtros.metrologoId) {
        query.metrologoId = filtros.metrologoId
    }

    const salidas = await Salida.find(query).sort({ fecha: 1, hora: 1 })
    return salidas
}

export const getSalidaById = async (id) => {
    const salida = await Salida.findById(id)
    if (!salida) throw new Error('Salida no encontrada')
    return salida
}

export const updateSalida = async (id, data) => {
    const salida = await Salida.findById(id)
    if (!salida) throw new Error('Salida no encontrada')

    // Solo consultamos al servicio de usuarios si cambió el metrólogo
    let metrologo = { id: salida.metrologoId, name: salida.metrologo }
    const cambioMetrologo = Boolean(data.metrologoId) && data.metrologoId !== salida.metrologoId

    if (cambioMetrologo) {
        metrologo = await obtenerMetrologoActivo(data.metrologoId)
    }

    const nuevaFecha = data.fecha ?? salida.fecha

    // Solo revalidamos disponibilidad si cambió el metrólogo o se envió fecha
    if (cambioMetrologo || data.fecha) {
        await validarDisponibilidadGlobal(metrologo, nuevaFecha, id, 'Salida')
    }

    const actualizada = await Salida.findByIdAndUpdate(
        id,
        {
            fecha: nuevaFecha,
            cliente: data.cliente ?? salida.cliente,
            metrologoId: metrologo.id,
            metrologo: metrologo.name,
            hora: data.hora ?? salida.hora,
            ois: data.ois ?? salida.ois,
            observaciones: data.observaciones ?? salida.observaciones
        },
        { new: true }
    )

    return actualizada
}

export const deleteSalida = async (id) => {
    const salida = await Salida.findById(id)
    if (!salida) throw new Error('Salida no encontrada')

    await salida.deleteOne()

    return { message: 'Salida eliminada correctamente' }
}