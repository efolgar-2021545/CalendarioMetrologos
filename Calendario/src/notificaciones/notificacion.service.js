import nodemailer from 'nodemailer'
import { correosMetrologos } from './notificacion.config.js'
import Salida from '../salidas/salida.model.js'
import Actividad from '../actividades/actividad.model.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const enviarCorreo = async (metrologo, datos, tipoCalendario) => {
    const correoDestino = correosMetrologos[metrologo]

    if (!correoDestino) {
        throw new Error(`No se encontró correo registrado para ${metrologo}`)
    }

    const nombreCalendario = tipoCalendario === 'salida'
        ? 'salida de campo'
        : 'actividad interna de laboratorio'

    await transporter.sendMail({
        from: `"Calendario de Salidas" <${process.env.EMAIL_USER}>`,
        to: correoDestino,
        subject: `Nueva ${nombreCalendario} agendada`,
        html: `
            <h2>Se te agendó una ${nombreCalendario}</h2>
            <p><strong>Cliente:</strong> ${datos.cliente}</p>
            <p><strong>Fecha:</strong> ${new Date(datos.fecha).toLocaleDateString('es-GT', { timeZone: 'UTC' })}</p>
            <p><strong>Hora:</strong> ${datos.hora}</p>
            <p><strong>OIS:</strong> ${datos.ois}</p>
            <p><strong>Observaciones:</strong> ${datos.observaciones || 'Sin observaciones'}</p>
        `
    })
}

// Correo de recordatorio (lo usa el módulo de recordatorios)
export const enviarRecordatorioCorreo = async (metrologo, datos, tipoCalendario) => {
    const correoDestino = correosMetrologos[metrologo]

    if (!correoDestino) {
        throw new Error(`No se encontró correo registrado para ${metrologo}`)
    }

    const nombreCalendario = tipoCalendario === 'salida'
        ? 'salida de campo'
        : 'actividad interna de laboratorio'

    await transporter.sendMail({
        from: `"Calendario de Salidas" <${process.env.EMAIL_USER}>`,
        to: correoDestino,
        subject: `Recordatorio: mañana tienes una ${nombreCalendario}`,
        html: `
            <h2>Recordatorio de ${nombreCalendario}</h2>
            <p>Mañana tienes lo siguiente agendado:</p>
            <p><strong>Cliente:</strong> ${datos.cliente}</p>
            <p><strong>Fecha:</strong> ${new Date(datos.fecha).toLocaleDateString('es-GT', { timeZone: 'UTC' })}</p>
            <p><strong>Hora:</strong> ${datos.hora}</p>
            <p><strong>OIS:</strong> ${datos.ois}</p>
            <p><strong>Observaciones:</strong> ${datos.observaciones || 'Sin observaciones'}</p>
        `
    })
}

// Notifica sobre una Salida (primer calendario) y marca el registro como notificado
export const notificarSalida = async (id) => {
    const salida = await Salida.findById(id)
    if (!salida) throw new Error('Salida no encontrada')

    await enviarCorreo(salida.metrologo, salida, 'salida')

    salida.notificacionEnviada = true
    await salida.save()

    return { message: `Notificación enviada a ${salida.metrologo}` }
}

// Notifica sobre una Actividad (segundo calendario) y marca el registro como notificado
export const notificarActividad = async (id) => {
    const actividad = await Actividad.findById(id)
    if (!actividad) throw new Error('Actividad no encontrada')

    await enviarCorreo(actividad.metrologo, actividad, 'actividad')

    actividad.notificacionEnviada = true
    await actividad.save()

    return { message: `Notificación enviada a ${actividad.metrologo}` }
}