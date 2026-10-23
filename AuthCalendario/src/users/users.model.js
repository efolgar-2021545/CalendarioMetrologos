import { DataTypes } from 'sequelize'

export const initUserModel = (sequelize) => {
    return sequelize.define('users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // PENDIENTE: pidió acceso y espera al Admin. APROBADO: el Admin lo aceptó.
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'PENDIENTE',
            validate: { isIn: [['PENDIENTE', 'APROBADO']] },
        },
        // Permite al Admin desactivar a un usuario ya aprobado
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    })
}