import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es.js'

import { getSalidas } from '../services/salidas.service.js'
import { getActividades } from '../services/actividades.service.js'
import { formatearFecha, diaDeRegistro } from '../utils/fechas.js'

// Qué función usa y de qué color se pinta cada calendario
const CONFIG = {
    salidas: { cargar: getSalidas, color: '#0f7482' },
    actividades: { cargar: getActividades, color: '#a5640f' }
}

// Convierte un registro del backend en un evento de FullCalendar
const aEvento = (registro, tipo) => ({
    id: registro._id,
    title: `${registro.metrologo} · ${registro.cliente}`,
    start: `${diaDeRegistro(registro.fecha)}T${registro.hora}:00`,
    backgroundColor: CONFIG[tipo].color,
    borderColor: CONFIG[tipo].color,
    extendedProps: { registro }
})

/**
 * Props:
 *  - tipo: 'salidas' | 'actividades'
 *  - refreshKey: al cambiar este número, se vuelven a cargar los datos (lo usará el Admin)
 *  - onEventClick(registro, tipo): se ejecuta al hacer clic en un evento
 *  - onDateClick(fecha): se ejecuta al hacer clic en un día (lo usará el Admin)
 */
const CalendarioVista = ({ tipo, refreshKey = 0, onEventClick, onDateClick }) => {
    const [rango, setRango] = useState(null)
    const [eventos, setEventos] = useState([])
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        // Todavía no sabemos qué rango muestra el calendario
        if (!rango) return

        // Evita que una respuesta vieja pise a una más reciente
        let cancelado = false

        const cargarDatos = async () => {
            setCargando(true)
            setError('')

            try {
                const registros = await CONFIG[tipo].cargar({
                    desde: rango.desde,
                    hasta: rango.hasta
                })

                if (!cancelado) {
                    setEventos(registros.map((r) => aEvento(r, tipo)))
                }
            } catch (err) {
                if (!cancelado) {
                    setError(
                        err.response?.data?.message ||
                        'No se pudieron cargar los datos. Verifica que el servidor esté encendido.'
                    )
                }
            } finally {
                if (!cancelado) setCargando(false)
            }
        }

        cargarDatos()

        return () => {
            cancelado = true
        }
    }, [tipo, rango, refreshKey])

    return (
        <div className="calendario-contenedor">
            {error && <p className="mensaje-error">{error}</p>}
            {cargando && <p className="mensaje-cargando">Cargando...</p>}

            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={eventos}
                height="auto"
                allDaySlot={false}
                nowIndicator
                slotMinTime="07:00:00"
                slotMaxTime="19:00:00"
                eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                datesSet={(arg) =>
                    setRango({
                        desde: formatearFecha(arg.start),
                        hasta: formatearFecha(arg.end)
                    })
                }
                eventClick={(info) =>
                    onEventClick?.(info.event.extendedProps.registro, tipo)
                }
                dateClick={(info) => onDateClick?.(info.dateStr)}
            />
        </div>
    )
}

export default CalendarioVista