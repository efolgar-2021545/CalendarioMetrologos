import dotenv from 'dotenv'

// Se carga aquí porque este archivo se evalúa antes que index.js
dotenv.config()

// FRONTEND_URL puede tener varios orígenes separados por coma
const origenesPermitidos = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())

export const corsOptions = {
    origin: origenesPermitidos,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}