import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { getHomePath } from './utils/roles.js'
import { ROLES } from './utils/constants.js'

import ProtectedRoute from './routes/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import CalendarioUsuario from './pages/CalendarioUsuario.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Historial from './pages/Historial.jsx'
import Metrologos from './pages/Metrologos.jsx'

// La ruta "/" manda a cada quien a su pantalla
const RedirectInicio = () => {
  const { user } = useAuth()
  return <Navigate to={getHomePath(user) ?? '/login'} replace />
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RedirectInicio />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/calendario"
        element={
          <ProtectedRoute allowedRoles={[ROLES.USUARIO]}>
            <CalendarioUsuario />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/historial"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Historial />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/metrologos"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Metrologos />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App