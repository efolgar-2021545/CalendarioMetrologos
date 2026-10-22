import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getRoleName, getHomePath } from '../utils/roles.js'

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useAuth()

    // Sin sesión: al login
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Con sesión pero rol equivocado: a su propia pantalla
    if (!allowedRoles.includes(getRoleName(user))) {
        return <Navigate to={getHomePath(user) ?? '/login'} replace />
    }

    return children
}

export default ProtectedRoute