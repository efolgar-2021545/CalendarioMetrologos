const dosDigitos = (n) => String(n).padStart(2, '0')

// Convierte un Date local a "AAAA-MM-DD" (para mandar rangos al backend)
export const formatearFecha = (date) =>
    `${date.getFullYear()}-${dosDigitos(date.getMonth() + 1)}-${dosDigitos(date.getDate())}`

// Del valor que guarda el backend ("2026-11-05T00:00:00.000Z") toma solo el día
export const diaDeRegistro = (fechaISO) => String(fechaISO).slice(0, 10)

// Texto legible: "jueves, 5 de noviembre de 2026"
export const fechaLarga = (fechaISO) =>
    new Date(`${diaDeRegistro(fechaISO)}T00:00:00Z`).toLocaleDateString('es-GT', {
        timeZone: 'UTC',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })