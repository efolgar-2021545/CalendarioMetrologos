import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { getHomePath } from './utils/roles.js'
import { ROLES } from './utils/constants.js'

import ProtectedRoute from './routes/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import CalendarioUsuario from './pages/CalendarioUsuario.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Solicitudes from './pages/Solicitudes.jsx'
import Historial from './pages/Historial.jsx'
import Metrologos from './pages/Metrologos.jsx'

// La ruta "/" manda a cada quien a su pantalla
const RedirectInicio = () => {
  const { user } = useAuth()
  return <Navigate to={getHomePath(user) ?? '/login'} replace />
}

const rutaAdmin = (elemento) => (
  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>{elemento}</ProtectedRoute>
)

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RedirectInicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route
        path="/calendario"
        element={
          <ProtectedRoute allowedRoles={[ROLES.USUARIO]}>
            <CalendarioUsuario />
          </ProtectedRoute>
        }
      />

      <Route path="/admin" element={rutaAdmin(<AdminPanel />)} />
      <Route path="/admin/solicitudes" element={rutaAdmin(<Solicitudes />)} />
      <Route path="/admin/historial" element={rutaAdmin(<Historial />)} />
      <Route path="/admin/metrologos" element={rutaAdmin(<Metrologos />)} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App