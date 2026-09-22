import { User, Role } from '../models/index.js'
import { comparePassword } from '../../helpers/hash-password.js'
import { generateJWT } from '../../helpers/generate-jwt.js'

export const loginUser = async (email, password) => {
    const user = await User.findOne({
        where: { email },
        include: Role
    })

    if (!user) throw new Error('Credenciales inválidas')

    const validPassword = await comparePassword(password, user.password)
    if (!validPassword) throw new Error('Credenciales inválidas')

    if (!user.isActive) throw new Error('Usuario inactivo, contacta al administrador')

    const token = generateJWT(user)

    const userWithoutPassword = user.toJSON()
    delete userWithoutPassword.password

    return {
        token,
        user: userWithoutPassword
    }
}