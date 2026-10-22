import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getRoleName } from '../utils/roles.js'

const Navbar = ({ titulo }) => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="navbar">
            <h1 className="navbar-titulo">{titulo}</h1>

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