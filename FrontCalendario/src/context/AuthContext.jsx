import { createContext, useContext, useState } from 'react'
import * as authService from '../services/auth.service.js'

const AuthContext = createContext(null)

// Lee el usuario guardado; si el JSON está dañado, lo descarta
const leerUsuarioGuardado = () => {
    try {
        const guardado = localStorage.getItem('user')
        return guardado ? JSON.parse(guardado) : null
    } catch {
        return null
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() =>
        localStorage.getItem('token') ? leerUsuarioGuardado() : null
    )

    const login = async (email, password) => {
        const { token, user: usuario } = await authService.login(email, password)

        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(usuario))
        setUser(usuario)

        return usuario
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider')
    }

    return context
}