import { User, Role } from '../models/index.js'
import { hashPassword, comparePassword } from '../../helpers/hash-password.js'
import { sendApprovalEmail } from '../../helpers/send-email.js'

const normalizarCorreo = (email) => String(email ?? '').trim().toLowerCase()
const correoValido = (email) => /^\S+@\S+\.\S+$/.test(email)

// ---------- Control de metrólogos ----------

// Metrólogos ya aprobados (rol USUARIO)
export const getMetrologos = async () => {
    return await User.findAll({
        where: { status: 'APROBADO' },
        include: {
            model: Role,
            where: { name: 'USUARIO' }
        },
        attributes: { exclude: ['password'] },
        order: [['name', 'ASC']]
    })
}

export const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        include: Role,
        attributes: { exclude: ['password'] }
    })

    if (!user) throw new Error('Usuario no encontrado')

    return user
}

// Solo se puede editar el correo: el nombre queda guardado en las salidas y actividades
export const updateUser = async (id, data) => {
    const user = await User.findByPk(id, { include: Role })

    if (!user) throw new Error('Usuario no encontrado')

    if (user.role?.name === 'ADMIN') {
        throw new Error('El administrador no se edita desde aquí')
    }

    const email = data.email !== undefined ? normalizarCorreo(data.email) : user.email

    if (!correoValido(email)) throw new Error('El correo no tiene un formato válido')

    if (email !== user.email) {
        const enUso = await User.findOne({ where: { email } })
        if (enUso) throw new Error('Ese correo ya está en uso por otro usuario')
    }

    await user.update({ email })

    const userWithoutPassword = user.toJSON()
    delete userWithoutPassword.password

    return userWithoutPassword
}

// Activar o desactivar a un metrólogo aprobado
export const toggleUserStatus = async (id) => {
    const user = await User.findByPk(id, { include: Role })

    if (!user) throw new Error('Usuario no encontrado')

    if (user.role?.name === 'ADMIN') {
        throw new Error('No se puede desactivar al administrador')
    }

    if (user.status !== 'APROBADO') {
        throw new Error('Este usuario aún no ha sido aprobado')
    }

    user.isActive = !user.isActive
    await user.save()

    return {
        id: user.id,
        name: user.name,
        isActive: user.isActive
    }
}

// ---------- Solicitudes de registro ----------

export const getSolicitudes = async () => {
    return await User.findAll({
        where: { status: 'PENDIENTE' },
        attributes: { exclude: ['password'] },
        order: [['created_at', 'ASC']]
    })
}

export const aprobarUsuario = async (id) => {
    const user = await User.findByPk(id)

    if (!user) throw new Error('Solicitud no encontrada')

    if (user.status !== 'PENDIENTE') {
        throw new Error('Esta solicitud ya fue procesada')
    }

    await user.update({ status: 'APROBADO', isActive: true })

    // El correo de aviso es opcional: si falla, la aprobación igual queda hecha
    let correoEnviado = true
    try {
        await sendApprovalEmail(user.email, user.name)
    } catch (error) {
        correoEnviado = false
        console.error('No se pudo enviar el correo de aprobación:', error.message)
    }

    return {
        message: `${user.name} fue aprobado correctamente`,
        correoEnviado
    }
}

// Rechazar elimina la solicitud (así la persona puede volver a solicitarla)
export const rechazarUsuario = async (id) => {
    const user = await User.findByPk(id)

    if (!user) throw new Error('Solicitud no encontrada')

    if (user.status !== 'PENDIENTE') {
        throw new Error('Solo se pueden rechazar solicitudes pendientes')
    }

    await user.destroy()

    return { message: `La solicitud de ${user.name} fue rechazada` }
}

// ---------- Directorio ----------

// Todos los usuarios aprobados (Admin incluido). Lo usan el formulario del Admin
// y el servicio Calendario para saber a quién agendar y a qué correo notificar.
export const getDirectorio = async () => {
    const users = await User.findAll({
        where: { status: 'APROBADO' },
        include: Role,
        attributes: { exclude: ['password'] },
        order: [['name', 'ASC']]
    })

    return users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isActive: u.isActive,
        role: u.role?.name
    }))
}

// ---------- Contraseña propia ----------

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