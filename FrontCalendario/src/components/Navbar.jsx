import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getRoleName } from '../utils/roles.js'
import { ROLES } from '../utils/constants.js'

const LINKS_ADMIN = [
    { to: '/admin', etiqueta: 'Calendarios', end: true },
    { to: '/admin/historial', etiqueta: 'Historial' },
    { to: '/admin/metrologos', etiqueta: 'Metrólogos' }
]

const Navbar = ({ titulo }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const esAdmin = getRoleName(user) === ROLES.ADMIN

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="navbar">
            <h1 className="navbar-titulo">{titulo}</h1>

            {esAdmin && (
                <nav className="navbar-links">
                    {LINKS_ADMIN.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) => `navbar-link ${isActive ? 'activo' : ''}`}
                        >
                            {link.etiqueta}
                        </NavLink>
                    ))}
                </nav>
            )}

            <div className="navbar-usuario">
                <span>
                    {user?.name} <small>({getRoleName(user)})</small>
                </span>
                <button className="btn btn-secundario" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
        </header>
    )
}

export default Navbar