import dotenv from 'dotenv'

dotenv.config()

export const config = {
    // Configuración JWT
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },

    // Configuración general de la app
    app: {
        port: process.env.PORT,
        frontendUrl: process.env.FRONTEND_URL,
    },
}