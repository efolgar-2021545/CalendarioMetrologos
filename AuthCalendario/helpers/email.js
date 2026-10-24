import nodemailer from 'nodemailer'

let transporter = null

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    }

    return transporter
}

// En la nube (BREVO_API_KEY) se envía por HTTPS; en local se sigue usando Gmail
export const enviarEmail = async ({ to, subject, html }) => {
    const brevoKey = process.env.BREVO_API_KEY

    if (brevoKey) {
        const remitente = process.env.BREVO_SENDER_EMAIL

        if (!remitente) {
            throw new Error('Falta BREVO_SENDER_EMAIL en las variables de entorno')
        }

        const respuesta = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': brevoKey,
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'Calendario de Salidas', email: remitente },
                to: [{ email: to }],
                subject,
                htmlContent: html
            }),
            signal: AbortSignal.timeout(20000)
        })

        if (!respuesta.ok) {
            const detalle = await respuesta.text().catch(() => '')
            throw new Error(
                `El servicio de correo rechazó el envío (${respuesta.status}). ${detalle.slice(0, 200)}`.trim()
            )
        }

        return
    }

    await getTransporter().sendMail({
        from: `"Calendario de Salidas" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    })
}