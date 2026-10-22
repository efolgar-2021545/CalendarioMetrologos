import Salida from '../salidas/salida.model.js'
import Actividad from '../actividades/actividad.model.js'
import { enviarRecordatorioCorreo } from '../notificaciones/notificacion.service.js'

const ZONA_HORARIA = 'America/Guatemala'
const UN_DIA_MS = 24 * 60 * 60 * 1000

// Calcula el rango del día de mañana según la hora de Guatemala.
// Las fechas se guardan a medianoche UTC, por eso el rango se arma en UTC.
const rangoDiaSiguiente = () => {
    const manana = new Date(Date.now() + UN_DIA_MS)
    const fechaTexto = manana.toLocaleDateString('en-CA', { timeZone: ZONA_HORARIA })

    const desde = new Date(`${fechaTexto}T00:00:00.000Z`)
    const hasta = new Date(desde.getTime() + UN_DIA_MS)

    return { desde, hasta, fechaTexto }
}

export const ejecutarRecordatorios = async () => {
    const { desde, hasta, fechaTexto } = rangoDiaSiguiente()
    const filtro = { fecha: { $gte: desde, $lt: hasta } }

    const [salidas, actividades] = await Promise.all([
        Salida.find(filtro),
        Actividad.find(filtro)
    ])

    const pendientes = [
        ...salidas.map((s) => ({ registro: s, tipo: 'salida' })),
        ...actividades.map((a) => ({ registro: a, tipo: 'actividad' }))
    ]

    let enviados = 0
    const fallidos = []

    // Si un correo falla, seguimos con los demás
    for (const { registro, tipo } of pendientes) {
        try {
            await enviarRecordatorioCorreo(registro.metrologo, registro, tipo)
            enviados++
        } catch (error) {
            fallidos.push({
                id: registro._id,
                metrologo: registro.metrologo,
                tipo,
                error: error.message
            })
        }
    }

    return {
        fecha: fechaTexto,
        totalEncontrados: pendientes.length,
        enviados,
        fallidos
    }
}