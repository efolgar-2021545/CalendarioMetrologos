import Salida from '../salidas/salida.model.js'
import Actividad from '../actividades/actividad.model.js'
import { obtenerUsuario } from '../shared/directorio.js'
import { enviarEmail } from '../shared/email.js'

const NOMBRES = {
    salida: 'salida de campo',
    actividad: 'actividad interna de laboratorio'
}

const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-GT', { timeZone: 'UTC' })

const detalleHtml = (datos) => `
    <p><strong>Cliente:</strong> ${datos.cliente}</p>
    <p><strong>Fecha:</strong> ${formatearFecha(datos.fecha)}</p>
    <p><strong>Hora:</strong> ${datos.hora}</p>
    <p><strong>OIS:</strong> ${datos.ois}</p>
    <p><strong>Observaciones:</strong> ${datos.observaciones || 'Sin observaciones'}</p>
`

// Correo de "se te agendó algo"
const enviarCorreo = async (correoDestino, datos, tipoCalendario) => {
    const nombre = NOMBRES[tipoCalendario]

    await enviarEmail({
        to: correoDestino,
        subject: `Nueva ${nombre} agendada`,
        html: `<h2>Se te agendó una ${nombre}</h2>${detalleHtml(datos)}`
    })
}

// Correo de recordatorio (lo usa el módulo de recordatorios)
export const enviarRecordatorioCorreo = async (correoDestino, datos, tipoCalendario) => {
    const nombre = NOMBRES[tipoCalendario]

    await enviarEmail({
        to: correoDestino,
        subject: `Recordatorio: mañana tienes una ${nombre}`,
        html: `<h2>Recordatorio de ${nombre}</h2><p>Mañana tienes lo siguiente agendado:</p>${detalleHtml(datos)}`
    })
}

// Notifica sobre una Salida (primer calendario) y marca el registro como notificado
export const notificarSalida = async (id) => {
    const salida = await Salida.findById(id)
    if (!salida) throw new Error('Salida no encontrada')

    const metrologo = await obtenerUsuario(salida.metrologoId)

    await enviarCorreo(metrologo.email, salida, 'salida')

    salida.notificacionEnviada = true
    await salida.save()

    return { message: `Notificación enviada a ${metrologo.name}` }
}

// Notifica sobre una Actividad (segundo calendario) y marca el registro como notificado
export const notificarActividad = async (id) => {
    const actividad = await Actividad.findById(id)
    if (!actividad) throw new Error('Actividad no encontrada')

    const metrologo = await obtenerUsuario(actividad.metrologoId)

    await enviarCorreo(metrologo.email, actividad, 'actividad')

    actividad.notificacionEnviada = true
    await actividad.save()

    return { message: `Notificación enviada a ${metrologo.name}` }
}