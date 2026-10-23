// Horas para la lista desplegable, de 7:00 a 18:00 cada 30 minutos
export const HORAS = Array.from({ length: 23 }, (_, i) => {
    const minutosTotales = 7 * 60 + i * 30
    const hh = String(Math.floor(minutosTotales / 60)).padStart(2, '0')
    const mm = String(minutosTotales % 60).padStart(2, '0')
    return `${hh}:${mm}`
})

export const ROLES = {
    ADMIN: 'ADMIN',
    USUARIO: 'USUARIO'
}