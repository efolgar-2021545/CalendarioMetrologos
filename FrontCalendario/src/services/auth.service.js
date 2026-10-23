import { authApi } from '../api/axios.js'

export const login = async (email, password) => {
    const { data } = await authApi.post('/auth/login', { email, password })
    return data
}

export const register = async (name, email, password) => {
    const { data } = await authApi.post('/auth/register', { name, email, password })
    return data
}

export const getProfile = async () => {
    const { data } = await authApi.get('/auth/profile')
    return data
}