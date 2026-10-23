import nodemailer from 'nodemailer'

export const sendApprovalEmail = async (email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const link = process.env.FRONTEND_URL || 'http://localhost:5173'

    await transporter.sendMail({
        from: `"Calendario de Salidas" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Tu cuenta fue aprobada',
        html: `
            <h2>¡Hola ${name}!</h2>
            <p>El administrador aprobó tu cuenta. Ya puedes iniciar sesión:</p>
            <p><a href="${link}">${link}</a></p>
        `
    })
}