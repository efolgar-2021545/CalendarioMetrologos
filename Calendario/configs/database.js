'use strict'

import mongoose from 'mongoose'

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | no se pudo conectar a mongoDB')
            mongoose.disconnect()
        })

        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | intentando conectar a mongoDB')
        })

        mongoose.connection.on('connected', () => {
            console.log('MongoDB | conectado a mongoDB')
        })

        mongoose.connection.on('open', () => {
            console.log('MongoDB | conectado a la base de datos Calendario')
        })

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | desconectando de mongoDB')
        })

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        })
    } catch (error) {
        console.log(`Error al conectar la db: ${error}`)
    }
}

const gracefulShutdown = async (signal) => {
    console.log(`MongoDB | Señal ${signal} recibida. Cerrando conexión...`)
    try {
        await mongoose.connection.close()
        console.log('MongoDB | Conexión cerrada correctamente')
        process.exit(0)
    } catch (error) {
        console.error('MongoDB | Error al cerrar:', error.message)
        process.exit(1)
    }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'))