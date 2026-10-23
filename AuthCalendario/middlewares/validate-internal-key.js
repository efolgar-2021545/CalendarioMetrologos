import crypto from 'crypto'

export const validateInternalKey = (req, res, next) => {
    const esperada = process.env.INTERNAL_API_KEY
    const recibida = req.header('x-internal-key')

    if (!esperada) {
        return res.status(500).json({
            message: 'INTERNAL_API_KEY no está configurada en AuthCalendario'
        })
    }

    if (!recibida) {
        return res.status(401).json({ message: 'Clave interna no proporcionada' })
    }

    const a = Buffer.from(String(recibida))
    const b = Buffer.from(esperada)

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(401).json({ message: 'Clave interna inválida' })
    }

    next()
}