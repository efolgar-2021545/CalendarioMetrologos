'use strict'

import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const opcionesComunes = {
    dialect: 'postgres',
    logging: process.env.DB_SQL_LOGGING === 'true' ? console.log : false,
    define: {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
}

// En la nube se usa una sola cadena (DATABASE_URL); en local, las variables DB_*
export const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        ...opcionesComunes,
        dialectOptions: {
            ssl: { require: true, rejectUnauthorized: false },
        },
    })
    : new Sequelize({
        ...opcionesComunes,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    })

// Función para conectar a la base de datos
export const dbConnection = async () => {
    try {
        console.log('PostgreSQL | Intentando conectar...')

        await sequelize.authenticate()
        console.log('PostgreSQL | Conectado correctamente')

        // En desarrollo se ajustan las tablas; en producción solo se crean las que falten
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
        console.log('PostgreSQL | Modelos sincronizados con la base de datos')
    } catch (error) {
        console.error('PostgreSQL | No se pudo conectar')
        console.error('PostgreSQL | Error:', error.message)
        process.exit(1)
    }
}

// Cierre ordenado de la conexión
const gracefulShutdown = async (signal) => {
    console.log(`PostgreSQL | Señal ${signal} recibida. Cerrando conexión...`)
    try {
        await sequelize.close()
        console.log('PostgreSQL | Conexión cerrada correctamente')
        process.exit(0)
    } catch (error) {
        console.error('PostgreSQL | Error al cerrar:', error.message)
        process.exit(1)
    }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'))