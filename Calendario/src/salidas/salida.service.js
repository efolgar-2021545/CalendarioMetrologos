import Salida from './salida.model.js'
import { validarDisponibilidadGlobal } from '../shared/disponibilidad.js'

export const createSalida = async (data, adminId) => {
    const { fecha, cliente, metrologo, hora, ois, observaciones } = data

    // Validación de disponibilidad global entre colecciones
    await validarDisponibilidadGlobal(metrologo, fecha)

    const salida = await Salida.create({
        fecha,
        cliente,
        metrologo,
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
    if (filtros.metrologo) {
        query.metrologo = filtros.metrologo
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

    const nuevoMetrologo = data.metrologo ?? salida.metrologo
    const nuevaFecha = data.fecha ?? salida.fecha

    // Solo revalidamos disponibilidad global si cambió el metrólogo o la fecha
    if (data.metrologo || data.fecha) {
        await validarDisponibilidadGlobal(nuevoMetrologo, nuevaFecha, id, 'Salida')
    }

    const actualizada = await Salida.findByIdAndUpdate(
        id,
        {
            fecha: nuevaFecha,
            cliente: data.cliente ?? salida.cliente,
            metrologo: nuevoMetrologo,
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