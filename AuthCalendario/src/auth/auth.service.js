import { User, Role, sequelize } from '../models/index.js'
import { hashPassword, comparePassword } from '../../helpers/hash-password.js'
import { generateJWT } from '../../helpers/generate-jwt.js'

const normalizarCorreo = (email) => String(email ?? '').trim().toLowerCase()

// Un usuario nuevo queda PENDIENTE hasta que el Admin lo apruebe
export const registerUser = async (data) => {
    const name = String(data?.name ?? '').trim()
    const email = normalizarCorreo(data?.email)
    const password = String(data?.password ?? '')

    if (!name || !email || !password) {
        throw new Error('Nombre, correo y contraseña son obligatorios')
    }

    if (name.length > 100) {
        throw new Error('El nombre no puede superar los 100 caracteres')
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('El correo no tiene un formato válido')
    }

    if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres')
    }

    const correoExiste = await User.findOne({ where: { email } })
    if (correoExiste) {
        throw new Error(
            correoExiste.status === 'PENDIENTE'
                ? 'Ya existe una solicitud pendiente con este correo'
                : 'El correo ya está registrado'
        )
    }

    // Los nombres deben ser únicos (sin importar mayúsculas) para no confundirlos en los calendarios
    const nombreExiste = await User.findOne({
        where: sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            name.toLowerCase()
        )
    })
    if (nombreExiste) {
        throw new Error('Ya existe un usuario con ese nombre. Agrega tu apellido u otro dato para diferenciarlo')
    }

    const role = await Role.findOne({ where: { name: 'USUARIO' } })
    if (!role) throw new Error('El rol USUARIO no existe. Reinicia el servidor de Auth')

    await User.create({
        name,
        email,
        password: await hashPassword(password),
        roleId: role.id,
        status: 'PENDIENTE',
        isActive: false
    })

    return {
        message: 'Solicitud enviada. Podrás ingresar cuando el administrador la apruebe.'
    }
}

export const loginUser = async (email, password) => {
    const correo = normalizarCorreo(email)

    if (!correo || !password) throw new Error('Credenciales inválidas')

    const user = await User.findOne({
        where: { email: correo },
        include: Role
    })

    if (!user) throw new Error('Credenciales inválidas')

    const validPassword = await comparePassword(String(password), user.password)
    if (!validPassword) throw new Error('Credenciales inválidas')

    // Solo se revela el estado a quien conoce la contraseña correcta
    if (user.status === 'PENDIENTE') {
        throw new Error('Tu solicitud aún está pendiente de aprobación por el administrador')
    }

    if (!user.isActive) throw new Error('Usuario inactivo, contacta al administrador')

    const token = generateJWT(user)

    const userWithoutPassword = user.toJSON()
    delete userWithoutPassword.password

    return {
        token,
        user: userWithoutPassword
    }
}