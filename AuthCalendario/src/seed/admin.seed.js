import { User, Role } from '../models/index.js'
import { hashPassword } from '../../helpers/hash-password.js'

export const seedAdminGeneral = async () => {
    const adminRole = await Role.findOne({ where: { name: 'ADMIN' } })

    // Si ya existe un Admin, no se crea otro
    const adminExistente = await User.findOne({ where: { roleId: adminRole.id } })

    if (adminExistente) {
        // Por si quedó pendiente o inactivo al agregar el campo status
        if (adminExistente.status !== 'APROBADO' || !adminExistente.isActive) {
            await adminExistente.update({ status: 'APROBADO', isActive: true })
        }
        return
    }

    const name = process.env.ADMIN_NAME?.trim()
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD

    if (!name || !email || !password) {
        console.error('Faltan ADMIN_NAME, ADMIN_EMAIL o ADMIN_PASSWORD en AuthCalendario/.env')
        process.exit(1)
    }

    const correoEnUso = await User.findOne({ where: { email } })
    if (correoEnUso) {
        console.error(
            `El correo ${email} ya pertenece a otro usuario. Bórralo de la tabla users o usa otro ADMIN_EMAIL`
        )
        process.exit(1)
    }

    await User.create({
        name,
        email,
        password: await hashPassword(password),
        roleId: adminRole.id,
        status: 'APROBADO',
        isActive: true
    })

    console.log(`Administrador creado: ${email}`)
}