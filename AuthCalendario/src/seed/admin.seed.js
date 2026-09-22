import { User, Role } from '../models/index.js'
import { hashPassword } from '../../helpers/hash-password.js'

// Cuentas base del sistema: el admin y los metrólogos
const seedUsers = [
    { name: 'Manuel', email: 'manuel@calendario.com', password: 'Manuel2026*', role: 'ADMIN' },
    { name: 'Dilsy', email: 'dilsy@calendario.com', password: 'Dilsy2026*', role: 'USUARIO' },
    { name: 'Alejandra', email: 'alejandra@calendario.com', password: 'Alejandra2026*', role: 'USUARIO' },
    { name: 'Hector', email: 'hector@calendario.com', password: 'Hector2026*', role: 'USUARIO' },
]

export const seedAdminGeneral = async () => {
    for (const seedUser of seedUsers) {
        const role = await Role.findOne({ where: { name: seedUser.role } })

        const exists = await User.findOne({ where: { email: seedUser.email } })

        if (!exists) {
            const hashedPassword = await hashPassword(seedUser.password)

            await User.create({
                name: seedUser.name,
                email: seedUser.email,
                password: hashedPassword,
                roleId: role.id,
                isActive: true
            })

            console.log(`Usuario ${seedUser.name} (${seedUser.role}) creado automáticamente`)
        }
    }
}