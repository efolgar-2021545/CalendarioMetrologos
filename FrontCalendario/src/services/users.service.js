import { authApi } from '../api/axios.js'

export const listMetrologos = async () => {
    const { data } = await authApi.get('/users/metrologos')
    return data
}

export const getMetrologo = async (id) => {
    const { data } = await authApi.get(`/users/metrologos/${id}`)
    return data
}

export const editMetrologo = async (id, body) => {
    const { data } = await authApi.put(`/users/metrologos/${id}`, body)
    return data
}

export const toggleMetrologoStatus = async (id) => {
    const { data } = await authApi.patch(`/users/metrologos/${id}/status`)
    return data
}

export const listSolicitudes = async () => {
    const { data } = await authApi.get('/users/solicitudes')
    return data
}

export const aprobarSolicitud = async (id) => {
    const { data } = await authApi.patch(`/users/solicitudes/${id}/aprobar`)
    return data
}

export const rechazarSolicitud = async (id) => {
    const { data } = await authApi.delete(`/users/solicitudes/${id}`)
    return data
}

// Usuarios aprobados (para elegir a quién agendar)
export const getDirectorio = async () => {
    const { data } = await authApi.get('/users/directorio')
    return data
}