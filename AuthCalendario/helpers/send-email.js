import { enviarEmail } from './email.js'

export const sendApprovalEmail = async (email, name) => {
    const link = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim()

    await enviarEmail({
        to: email,
        subject: 'Tu cuenta fue aprobada',
        html: `
            <h2>¡Hola ${name}!</h2>
            <p>El administrador aprobó tu cuenta. Ya puedes iniciar sesión:</p>
            <p><a href="${link}">${link}</a></p>
        `
    })
}