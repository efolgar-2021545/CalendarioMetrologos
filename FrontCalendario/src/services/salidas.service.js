import { calendarioApi } from '../api/axios.js'

export const getSalidas = async (params = {}) => {
    const { data } = await calendarioApi.get('/salidas', { params })
    return data.salidas
}

export const getSalidaById = async (id) => {
    const { data } = await calendarioApi.get(`/salidas/${id}`)
    return data.salida
}

export const createSalida = async (body) => {
    const { data } = await calendarioApi.post('/salidas', body)
    return data.salida
}

export const updateSalida = async (id, body) => {
    const { data } = await calendarioApi.put(`/salidas/${id}`, body)
    return data.salida
}

export const deleteSalida = async (id) => {
    const { data } = await calendarioApi.delete(`/salidas/${id}`)
    return data
}