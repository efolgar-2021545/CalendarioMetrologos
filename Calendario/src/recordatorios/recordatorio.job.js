import cron from 'node-cron'
import { ejecutarRecordatorios } from './recordatorio.service.js'

export const iniciarRecordatorios = () => {
    // Todos los días a las 7:00 a.m. (hora de Guatemala)
    cron.schedule(
        '0 7 * * *',
        async () => {
            try {
                const resultado = await ejecutarRecordatorios()
                console.log('Recordatorios | Ejecutados:', resultado)
            } catch (error) {
                console.error('Recordatorios | Error:', error.message)
            }
        },
        { timezone: 'America/Guatemala' }
    )

    console.log('Recordatorios | Programados todos los días a las 7:00 a.m.')
}