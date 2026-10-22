import { ejecutarRecordatorios } from './recordatorio.service.js'

export const ejecutarManual = async (req, res) => {
    try {
        const resultado = await ejecutarRecordatorios()
        return res.json({
            success: true,
            resultado
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}