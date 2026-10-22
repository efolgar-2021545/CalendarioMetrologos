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