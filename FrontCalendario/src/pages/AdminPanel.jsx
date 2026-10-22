import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import CalendarioVista from '../components/CalendarioVista.jsx'
import FormularioRegistro from '../components/FormularioRegistro.jsx'

const CALENDARIOS = [
    { id: 'salidas', etiqueta: 'Salidas de metrólogos', agregar: '+ Agregar salida' },
    { id: 'actividades', etiqueta: 'Actividades del laboratorio', agregar: '+ Agregar actividad' }
]

const AdminPanel = () => {
    const [tipo, setTipo] = useState('salidas')
    const [refreshKey, setRefreshKey] = useState(0)
    const [formulario, setFormulario] = useState(null)
    const [aviso, setAviso] = useState(null)

    const calendarioActual = CALENDARIOS.find((c) => c.id === tipo)

    // Abre el formulario vacío (botón "+ Agregar")
    const abrirNuevo = () => {
        setAviso(null)
        setFormulario({ tipo, registro: null, fecha: '', hora: '' })
    }

    // Abre el formulario con la fecha (y hora) del lugar donde se hizo clic
    const abrirDesdeFecha = (dateStr) => {
        setAviso(null)
        setFormulario({
            tipo,
            registro: null,
            fecha: dateStr.slice(0, 10),
            hora: dateStr.length > 10 ? dateStr.slice(11, 16) : ''
        })
    }

    // Abre el formulario en modo edición
    const abrirEdicion = (registro) => {
        setAviso(null)
        setFormulario({ tipo, registro, fecha: '', hora: '' })
    }

    const handleGuardado = (resultado) => {
        setFormulario(null)
        setAviso(resultado)
        setRefreshKey((k) => k + 1)
    }

    return (
        <>
            <Navbar titulo="Panel de Administración" />

            <main className="contenido">
                <div className="panel-barra">
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

                    <button className="btn btn-primario" onClick={abrirNuevo}>
                        {calendarioActual.agregar}
                    </button>
                </div>

                {aviso && (
                    <p className={aviso.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>
                        {aviso.texto}
                    </p>
                )}

                <p className="ayuda-texto">
                    Haz clic en un día para agregar, o en un evento para editarlo o eliminarlo.
                </p>

                <CalendarioVista
                    tipo={tipo}
                    refreshKey={refreshKey}
                    onEventClick={abrirEdicion}
                    onDateClick={abrirDesdeFecha}
                />
            </main>

            {formulario && (
                <FormularioRegistro
                    key={formulario.registro?._id || `nuevo-${formulario.fecha}-${formulario.hora}`}
                    tipo={formulario.tipo}
                    registro={formulario.registro}
                    fechaInicial={formulario.fecha}
                    horaInicial={formulario.hora}
                    onClose={() => setFormulario(null)}
                    onGuardado={handleGuardado}
                />
            )}
        </>
    )
}

export default AdminPanel