import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import './index.css'

// Los servidores gratuitos se duermen: se despiertan mientras la persona escribe sus datos
const servidores = [import.meta.env.VITE_AUTH_URL, import.meta.env.VITE_CALENDARIO_URL]

servidores.forEach((base) => {
  if (base) {
    fetch(`${base}/health`).catch(() => { })
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)