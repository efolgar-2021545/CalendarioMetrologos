import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    try {
        const header = req.headers.authorization

        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No has proporcionado un token'
            })
        }

        const token = header.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // decoded trae { uid, role } (el role es el roleId de Postgres)
        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o caducado'
        })
    }
}