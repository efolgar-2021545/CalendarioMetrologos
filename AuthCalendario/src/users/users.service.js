import { User, Role } from '../models/index.js'
import { hashPassword, comparePassword } from '../../helpers/hash-password.js'

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

// Cambiar la contraseña propia (Admin o metrólogo)
export const changePassword = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw new Error('Debes enviar la contraseña actual y la nueva')
    }

    if (newPassword.length < 8) {
        throw new Error('La nueva contraseña debe tener al menos 8 caracteres')
    }

    const user = await User.findByPk(userId)

    if (!user) throw new Error('Usuario no encontrado')

    const coincide = await comparePassword(currentPassword, user.password)
    if (!coincide) throw new Error('Contraseña actual incorrecta')

    await user.update({ password: await hashPassword(newPassword) })

    return { message: 'Contraseña actualizada correctamente' }
}