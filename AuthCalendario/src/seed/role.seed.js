import { Role } from '../models/index.js'

export const seedRoles = async () => {
    const roles = [
        'ADMIN',
        'USUARIO'
    ]

    for (const roleName of roles) {
        const exists = await Role.findOne({ where: { name: roleName } })

        if (!exists) {
            await Role.create({ name: roleName })
            console.log(`Role ${roleName} creado satisfactoriamente`)
        }
    }
}