import dotenv from 'dotenv'

// Se carga aquí porque este archivo se evalúa antes que dotenv.config() de index.js
dotenv.config()

const origenesPermitidos = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())

export const corsOptions = {
    origin: origenesPermitidos,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}