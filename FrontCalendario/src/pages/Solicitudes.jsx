import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import {
    listSolicitudes,
    aprobarSolicitud,
    rechazarSolicitud
} from '../services/users.service.js'

const fechaSolicitud = (solicitud) => {
    const valor = solicitud.created_at ?? solicitud.createdAt
    return valor ? new Date(valor).toLocaleString('es-GT') : '—'
}

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [aviso, setAviso] = useState(null)
    const [procesandoId, setProcesandoId] = useState(null)

    const cargar = async () => {
        try {
            setError('')
            setSolicitudes(await listSolicitudes())
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'No se pudo cargar la lista. Verifica que el servidor de Auth esté encendido.'
            )
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargar()
    }, [])

    const handleAprobar = async (solicitud) => {
        setProcesandoId(solicitud.id)
        setAviso(null)

        try {
            const resultado = await aprobarSolicitud(solicitud.id)
            setAviso({
                tipo: 'ok',
                texto:
                    resultado.message +
                    (resultado.correoEnviado === false
                        ? ' (no se pudo enviar el correo de aviso, avísale tú)'
                        : ' y se le avisó por correo')
            })
            await cargar()
        } catch (err) {
            setAviso({
                tipo: 'error',
                texto: err.response?.data?.message || 'No se pudo aprobar la solicitud.'
            })
        } finally {
            setProcesandoId(null)
        }
    }

    const handleRechazar = async (solicitud) => {
        const confirmado = window.confirm(
            `¿Rechazar la solicitud de ${solicitud.name}? Se eliminará y podrá volver a solicitarla.`
        )
        if (!confirmado) return

        setProcesandoId(solicitud.id)
        setAviso(null)

        try {
            const resultado = await rechazarSolicitud(solicitud.id)
            setAviso({ tipo: 'ok', texto: resultado.message })
            await cargar()
        } catch (err) {
            setAviso({
                tipo: 'error',
                texto: err.response?.data?.message || 'No se pudo rechazar la solicitud.'
            })
        } finally {
            setProcesandoId(null)
        }
    }

    return (
        <>
            <Navbar titulo="Solicitudes de registro" />

            <main className="contenido">
                {aviso && (
                    <p className={aviso.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>{aviso.texto}</p>
                )}

                {error && <p className="mensaje-error">{error}</p>}

                <section className="bloque">
                    <h2>Usuarios esperando aprobación</h2>

                    {cargando ? (
                        <p className="mensaje-cargando">Cargando...</p>
                    ) : solicitudes.length === 0 ? (
                        <p className="texto-vacio">No hay solicitudes pendientes.</p>
                    ) : (
                        <div className="tabla-scroll">
                            <table className="tabla">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Solicitó</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {solicitudes.map((s) => (
                                        <tr key={s.id}>
                                            <td>{s.name}</td>
                                            <td>{s.email}</td>
                                            <td>{fechaSolicitud(s)}</td>
                                            <td className="celda-acciones">
                                                <button
                                                    className="btn btn-primario btn-chico"
                                                    onClick={() => handleAprobar(s)}
                                                    disabled={procesandoId === s.id}
                                                >
                                                    Aprobar
                                                </button>
                                                <button
                                                    className="btn btn-peligro btn-chico"
                                                    onClick={() => handleRechazar(s)}
                                                    disabled={procesandoId === s.id}
                                                >
                                                    Rechazar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}

export default Solicitudes