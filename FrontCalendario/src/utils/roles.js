import { ROLES } from './constants.js'

// Devuelve el nombre del rol de un usuario (viene como user.role.name desde el backend)
export const getRoleName = (user) => user?.role?.name ?? null

// Devuelve la ruta de inicio según el rol, o null si el rol no se reconoce
export const getHomePath = (user) => {
    const role = getRoleName(user)

    if (role === ROLES.ADMIN) return '/admin'
    if (role === ROLES.USUARIO) return '/calendario'

    return null
}