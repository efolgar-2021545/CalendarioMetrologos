import Salida from '../salidas/salida.model.js'
import Actividad from '../actividades/actividad.model.js'

// Compara solo el día (sin horas), usando UTC para no depender de la zona horaria del servidor
const mismoDia = (fechaA, fechaB) => {
    const a = new Date(fechaA)
    const b = new Date(fechaB)
    return (
        a.getUTCFullYear() === b.getUTCFullYear() &&
        a.getUTCMonth() === b.getUTCMonth() &&
        a.getUTCDate() === b.getUTCDate()
    )
}

/**
 * Valida que un metrólogo no tenga ya algo agendado ese mismo día,
 * ni en Salidas ni en Actividades (los dos calendarios).
 * Si es un día distinto, no hay problema (se permite).
 *
 * @param {{id: string, name: string}} metrologo
 * @param {Date|string} fecha - fecha a validar
 * @param {string|null} excluirId - id del propio registro cuando se está editando
 * @param {'Salida'|'Actividad'} excluirColeccion - a qué colección pertenece excluirId
 */
export const validarDisponibilidadGlobal = async (
    metrologo,
    fecha,
    excluirId = null,
    excluirColeccion = null
) => {
    const [salidasDelMetrologo, actividadesDelMetrologo] = await Promise.all([
        Salida.find({ metrologoId: metrologo.id }),
        Actividad.find({ metrologoId: metrologo.id })
    ])

    const chocaEnSalidas = salidasDelMetrologo.some((s) => {
        if (excluirColeccion === 'Salida' && s._id.toString() === excluirId) return false
        return mismoDia(s.fecha, fecha)
    })

    const chocaEnActividades = actividadesDelMetrologo.some((a) => {
        if (excluirColeccion === 'Actividad' && a._id.toString() === excluirId) return false
        return mismoDia(a.fecha, fecha)
    })

    if (chocaEnSalidas || chocaEnActividades) {
        throw new Error(
            `${metrologo.name} ya tiene una salida o actividad agendada ese mismo día`
        )
    }
}