import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import CalendarioVista from '../components/CalendarioVista.jsx'
import DetalleModal from '../components/DetalleModal.jsx'

const CALENDARIOS = [
    { id: 'salidas', etiqueta: 'Salidas de metrólogos' },
    { id: 'actividades', etiqueta: 'Actividades del laboratorio' }
]

const CalendarioUsuario = () => {
    const [tipo, setTipo] = useState('salidas')
    const [seleccionado, setSeleccionado] = useState(null)

    return (
        <>
            <Navbar titulo="Calendario" />

            <main className="contenido">
                <div className="selector-calendario">
                    {CALENDARIOS.map((cal) => (
                        <button
                            key={cal.id}
                            className={`btn-tab ${tipo === cal.id ? 'activo' : ''}`}
                            onClick={() => setTipo(cal.id)}
                        >
                            {cal.etiqueta}
                        </button>
                    ))}
                </div>

                <CalendarioVista
                    tipo={tipo}
                    onEventClick={(registro) => setSeleccionado(registro)}
                />
            </main>

            <DetalleModal
                registro={seleccionado}
                tipo={tipo}
                onClose={() => setSeleccionado(null)}
            />
        </>
    )
}

export default CalendarioUsuario