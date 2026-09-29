import Salida from './salida.model.js'

// Helper para comparar solo el día (sin horas) al validar duplicados
const mismoDia = (fechaA, fechaB) => {
    const a = new Date(fechaA)
    const b = new Date(fechaB)
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

// Valida que el metrólogo no tenga ya una salida ese mismo día
// (excluye la propia salida cuando se está editando)
const validarDisponibilidad = async (metrologo, fecha, salidaIdExcluir = null) => {
    const salidasDelMetrologo = await Salida.find({ metrologo })

    const yaAgendado = salidasDelMetrologo.some((salida) => {
        if (salidaIdExcluir && salida._id.toString() === salidaIdExcluir) return false
        return mismoDia(salida.fecha, fecha)
    })

    if (yaAgendado) {
        throw new Error(`${metrologo} ya tiene una salida agendada ese día`)
    }
}

export const createSalida = async (data, adminId) => {
    const { fecha, cliente, metrologo, hora, ois, observaciones } = data

    await validarDisponibilidad(metrologo, fecha)

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

    // Solo revalidamos disponibilidad si cambió el metrólogo o la fecha
    if (data.metrologo || data.fecha) {
        await validarDisponibilidad(nuevoMetrologo, nuevaFecha, id)
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