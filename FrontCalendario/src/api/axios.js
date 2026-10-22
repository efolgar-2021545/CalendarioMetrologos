import axios from 'axios'

const crearInstancia = (baseURL) => {
    const instancia = axios.create({ baseURL })

    // Agrega el token a cada petición si existe
    instancia.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    })

    // Si el token venció o es inválido, cerramos la sesión
    instancia.interceptors.response.use(
        (respuesta) => respuesta,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/login'
            }
            return Promise.reject(error)
        }
    )

    return instancia
}

// Servicio de autenticación y metrólogos (puerto 4000)
export const authApi = crearInstancia(import.meta.env.VITE_AUTH_URL)

// Servicio de calendarios (puerto 4001)
export const calendarioApi = crearInstancia(import.meta.env.VITE_CALENDARIO_URL)