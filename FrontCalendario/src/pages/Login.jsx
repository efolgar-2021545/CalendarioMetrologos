import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getHomePath } from '../utils/roles.js'

const Login = () => {
    const { user, login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)

    // Si ya hay sesión, no tiene sentido ver el login
    const homeActual = getHomePath(user)
    if (user && homeActual) {
        return <Navigate to={homeActual} replace />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setCargando(true)

        try {
            const usuario = await login(email, password)
            const destino = getHomePath(usuario)

            if (!destino) {
                setError('Tu usuario no tiene un rol válido. Contacta al administrador.')
                return
            }

            navigate(destino, { replace: true })
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'No se pudo conectar con el servidor. Verifica que esté encendido.'
            )
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="login-pagina">
            <form className="login-tarjeta" onSubmit={handleSubmit}>
                <h1>Calendario de Salidas</h1>
                <p className="login-subtitulo">Inicia sesión para continuar</p>

                <label htmlFor="email">Correo</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                />

                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />

                {error && <p className="mensaje-error">{error}</p>}

                <button className="btn btn-primario" type="submit" disabled={cargando}>
                    {cargando ? 'Ingresando...' : 'Ingresar'}
                </button>

                <Link to="/registro" className="btn btn-secundario btn-enlace">
                    Crear cuenta
                </Link>
            </form>
        </div>
    )
}

export default Login