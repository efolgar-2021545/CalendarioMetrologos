import { calendarioApi } from '../api/axios.js'

export const getActividades = async (params = {}) => {
    const { data } = await calendarioApi.get('/actividades', { params })
    return data.actividades
}

export const getActividadById = async (id) => {
    const { data } = await calendarioApi.get(`/actividades/${id}`)
    return data.actividad
}

export const createActividad = async (body) => {
    const { data } = await calendarioApi.post('/actividades', body)
    return data.actividad
}

export const updateActividad = async (id, body) => {
    const { data } = await calendarioApi.put(`/actividades/${id}`, body)
    return data.actividad
}

export const deleteActividad = async (id) => {
    const { data } = await calendarioApi.delete(`/actividades/${id}`)
    return data
}