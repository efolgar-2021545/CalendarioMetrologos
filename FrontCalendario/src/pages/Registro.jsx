import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { register } from '../services/auth.service.js'
import { getHomePath } from '../utils/roles.js'

const Registro = () => {
    const { user } = useAuth()

    const [form, setForm] = useState({ name: '', email: '', password: '', confirmar: '' })
    const [error, setError] = useState('')
    const [cargando, setCargando] = useState(false)
    const [enviado, setEnviado] = useState(false)

    // Si ya hay sesión, no tiene sentido ver el registro
    const homeActual = getHomePath(user)
    if (user && homeActual) {
        return <Navigate to={homeActual} replace />
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirmar) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (form.password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return
        }

        setCargando(true)

        try {
            await register(form.name.trim(), form.email.trim(), form.password)
            setEnviado(true)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'No se pudo enviar la solicitud. Verifica que el servidor esté encendido.'
            )
        } finally {
            setCargando(false)
        }
    }

    if (enviado) {
        return (
            <div className="login-pagina">
                <div className="login-tarjeta">
                    <h1>Solicitud enviada</h1>
                    <p className="mensaje-ok">
                        Tu solicitud fue enviada al administrador. Podrás iniciar sesión cuando la apruebe.
                    </p>
                    <Link to="/login" className="btn btn-primario btn-enlace">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="login-pagina">
            <form className="login-tarjeta" onSubmit={handleSubmit}>
                <h1>Crear cuenta</h1>
                <p className="login-subtitulo">El administrador debe aprobar tu solicitud</p>

                <label htmlFor="name">Nombre</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                />

                <label htmlFor="email">Correo</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                />

                <label htmlFor="password">Contraseña (mínimo 8 caracteres)</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />

                <label htmlFor="confirmar">Confirmar contraseña</label>
                <input
                    id="confirmar"
                    name="confirmar"
                    type="password"
                    value={form.confirmar}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />

                {error && <p className="mensaje-error">{error}</p>}

                <button className="btn btn-primario" type="submit" disabled={cargando}>
                    {cargando ? 'Enviando...' : 'Enviar solicitud'}
                </button>

                <Link to="/login" className="btn btn-secundario btn-enlace">
                    Ya tengo cuenta
                </Link>
            </form>
        </div>
    )
}

export default Registro