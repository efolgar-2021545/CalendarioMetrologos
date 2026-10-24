import cron from 'node-cron'
import { ejecutarRecordatorios } from './recordatorio.service.js'

export const iniciarRecordatorios = () => {
    // En la nube el servidor se duerme, así que el recordatorio lo dispara un programador externo
    if (process.env.DISABLE_INTERNAL_CRON === 'true') {
        console.log('Recordatorios | Programador interno desactivado (se usa uno externo)')
        return
    }

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