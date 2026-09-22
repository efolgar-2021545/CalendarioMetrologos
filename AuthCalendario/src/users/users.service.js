import { User, Role } from '../models/index.js'

// Listar todos los metrólogos (rol USUARIO) para el Admin
export const getMetrologos = async () => {
    const metrologos = await User.findAll({
        include: {
            model: Role,
            where: { name: 'USUARIO' }
        },
        attributes: { exclude: ['password'] }
    })

    return metrologos
}

// Ver el detalle de un metrólogo específico
export const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        include: Role,
        attributes: { exclude: ['password'] }
    })

    if (!user) throw new Error('Usuario no encontrado')

    return user
}

// Editar datos básicos de un metrólogo (nombre, correo)
export const updateUser = async (id, data) => {
    const user = await User.findByPk(id)

    if (!user) throw new Error('Usuario no encontrado')

    const { name, email } = data

    await user.update({
        name: name ?? user.name,
        email: email ?? user.email
    })

    const userWithoutPassword = user.toJSON()
    delete userWithoutPassword.password

    return userWithoutPassword
}

// Activar o desactivar a un metrólogo (control de acceso)
export const toggleUserStatus = async (id) => {
    const user = await User.findByPk(id)

    if (!user) throw new Error('Usuario no encontrado')

    user.isActive = !user.isActive
    await user.save()

    return {
        id: user.id,
        name: user.name,
        isActive: user.isActive
    }
}