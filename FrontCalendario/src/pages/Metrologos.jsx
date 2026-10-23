import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import EditarMetrologoModal from '../components/EditarMetrologoModal.jsx'
import RecordatoriosCard from '../components/RecordatoriosCard.jsx'
import { listMetrologos, toggleMetrologoStatus } from '../services/users.service.js'

const Metrologos = () => {
    const [metrologos, setMetrologos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [aviso, setAviso] = useState(null)
    const [editando, setEditando] = useState(null)
    const [procesandoId, setProcesandoId] = useState(null)

    const cargar = async () => {
        try {
            setError('')
            setMetrologos(await listMetrologos())
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

    const handleToggle = async (metrologo) => {
        if (metrologo.isActive) {
            const confirmado = window.confirm(
                `¿Desactivar a ${metrologo.name}? No podrá iniciar sesión hasta que lo actives de nuevo.`
            )
            if (!confirmado) return
        }

        setProcesandoId(metrologo.id)
        setAviso(null)

        try {
            const resultado = await toggleMetrologoStatus(metrologo.id)
            setAviso({
                tipo: 'ok',
                texto: `${resultado.name} ahora está ${resultado.isActive ? 'activo' : 'inactivo'}`
            })
            await cargar()
        } catch (err) {
            setAviso({
                tipo: 'error',
                texto: err.response?.data?.message || 'No se pudo cambiar el estado.'
            })
        } finally {
            setProcesandoId(null)
        }
    }

    const handleGuardado = (resultado) => {
        setEditando(null)
        setAviso(resultado)
        cargar()
    }

    return (
        <>
            <Navbar titulo="Control de metrólogos" />

            <main className="contenido">
                {aviso && (
                    <p className={aviso.tipo === 'ok' ? 'mensaje-ok' : 'mensaje-error'}>{aviso.texto}</p>
                )}

                {error && <p className="mensaje-error">{error}</p>}

                <section className="bloque">
                    <h2>Metrólogos</h2>

                    {cargando ? (
                        <p className="mensaje-cargando">Cargando...</p>
                    ) : (
                        <div className="tabla-scroll">
                            <table className="tabla">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrologos.map((m) => (
                                        <tr key={m.id}>
                                            <td>{m.name}</td>
                                            <td>{m.email}</td>
                                            <td>
                                                <span className={`etiqueta ${m.isActive ? 'etiqueta-ok' : 'etiqueta-inactivo'}`}>
                                                    {m.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="celda-acciones">
                                                <button
                                                    className="btn btn-secundario btn-chico"
                                                    onClick={() => setEditando(m)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className={`btn btn-chico ${m.isActive ? 'btn-peligro' : 'btn-primario'}`}
                                                    onClick={() => handleToggle(m)}
                                                    disabled={procesandoId === m.id}
                                                >
                                                    {m.isActive ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <p className="ayuda-texto">
                        El administrador no aparece en esta lista. Las cuentas nuevas se aprueban en la sección Solicitudes.
                    </p>
                </section>

                <RecordatoriosCard />
            </main>

            {editando && (
                <EditarMetrologoModal
                    metrologo={editando}
                    onClose={() => setEditando(null)}
                    onGuardado={handleGuardado}
                />
            )}
        </>
    )
}

export default Metrologos