export const validateRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(500).json({
                success: false,
                message: 'Se intenta verificar rol sin validar el token primero'
            })
        }

        const userRole = req.user.roleName

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Rol ${userRole} no autorizado`
            })
        }

        next()
    }
}