import { calendarioApi } from '../api/axios.js'

export const notificarSalida = async (id) => {
    const { data } = await calendarioApi.post(`/notificaciones/salida/${id}`)
    return data
}

export const notificarActividad = async (id) => {
    const { data } = await calendarioApi.post(`/notificaciones/actividad/${id}`)
    return data
}