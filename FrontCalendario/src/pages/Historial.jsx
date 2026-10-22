import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { getResumenAnual, getDetalleMes } from '../services/historial.service.js'
import { METROLOGOS } from '../utils/constants.js'
import { fechaCorta } from '../utils/fechas.js'

const anioActual = new Date().getFullYear()
const ANIOS = [anioActual + 1, anioActual, anioActual - 1, anioActual - 2]

const mensajeDeError = (err) =>
    err.response?.data?.message || 'No se pudieron cargar los datos. Verifica que el servidor esté encendido.'

// Tabla reutilizable para el detalle de salidas y actividades
const TablaRegistros = ({ titulo, registros }) => (
    <div className="bloque-tabla">
        <h3>{titulo} ({registros.length})</h3>

        {registros.length === 0 ? (
            <p className="texto-vacio">No hay registros este mes.</p>
        ) : (
            <div className="tabla-scroll">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Metrólogo</th>
                            <th>OIS</th>
                            <th>Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((r) => (
                            <tr key={r._id}>
                                <td>{fechaCorta(r.fecha)}</td>
                                <td>{r.hora}</td>
                                <td>{r.cliente}</td>
                                <td>{r.metrologo}</td>
                                <td>{r.ois}</td>
                                <td>{r.observaciones || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
)

const Historial = () => {
    const [anio, setAnio] = useState(anioActual)
    const [resumen, setResumen] = useState(null)
    const [detalle, setDetalle] = useState(null)
    const [cargando, setCargando] = useState(false)
    const [cargandoDetalle, setCargandoDetalle] = useState(false)
    const [error, setError] = useState('')

    // Carga el resumen anual cada vez que cambia el año
    useEffect(() => {
        let cancelado = false

        const cargar = async () => {
            setCargando(true)
            setError('')
            setDetalle(null)

            try {
                const datos = await getResumenAnual(anio)
                if (!cancelado) setResumen(datos)
            } catch (err) {
                if (!cancelado) setError(mensajeDeError(err))
            } finally {
                if (!cancelado) setCargando(false)
            }
        }

        cargar()

        return () => {
            cancelado = true
        }
    }, [anio])

    const verDetalle = async (mes) => {
        setCargandoDetalle(true)
        setError('')

        try {
            setDetalle(await getDetalleMes(anio, mes))
        } catch (err) {
            setError(mensajeDeError(err))
        } finally {
            setCargandoDetalle(false)
        }
    }

    // Total (salidas + actividades) de un metrólogo en un mes
    const totalMetrologo = (mes, nombre) => {
        const datos = mes.porMetrologo[nombre]
        return datos ? datos.salidas + datos.actividades : 0
    }

    // Total de un metrólogo en todo el año
    const totalAnualMetrologo = (nombre) =>
        resumen.meses.reduce((suma, mes) => suma + totalMetrologo(mes, nombre), 0)

    return (
        <>
            <Navbar titulo="Historial de visitas y servicios" />

            <main className="contenido">
                <div className="panel-barra">
                    <div className="campo campo-anio">
                        <label htmlFor="anio">Año</label>
                        <select id="anio" value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
                            {ANIOS.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && <p className="mensaje-error">{error}</p>}
                {cargando && <p className="mensaje-cargando">Cargando...</p>}

                {resumen && !cargando && (
                    <>
                        <div className="tarjetas-resumen">
                            <div className="tarjeta">
                                <span className="tarjeta-numero">{resumen.totalAnual.salidas}</span>
                                <span className="tarjeta-etiqueta">Salidas en {resumen.anio}</span>
                            </div>
                            <div className="tarjeta">
                                <span className="tarjeta-numero">{resumen.totalAnual.actividades}</span>
                                <span className="tarjeta-etiqueta">Actividades en {resumen.anio}</span>
                            </div>
                            <div className="tarjeta">
                                <span className="tarjeta-numero">{resumen.totalAnual.total}</span>
                                <span className="tarjeta-etiqueta">Total del año</span>
                            </div>
                        </div>

                        <div className="tabla-scroll">
                            <table className="tabla">
                                <thead>
                                    <tr>
                                        <th>Mes</th>
                                        <th>Salidas</th>
                                        <th>Actividades</th>
                                        <th>Total</th>
                                        {METROLOGOS.map((m) => (
                                            <th key={m}>{m}</th>
                                        ))}
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resumen.meses.map((mes) => (
                                        <tr
                                            key={mes.mes}
                                            className={detalle?.mes === mes.mes ? 'fila-activa' : ''}
                                        >
                                            <td>{mes.nombre}</td>
                                            <td>{mes.salidas}</td>
                                            <td>{mes.actividades}</td>
                                            <td><strong>{mes.total}</strong></td>
                                            {METROLOGOS.map((m) => (
                                                <td key={m}>{totalMetrologo(mes, m)}</td>
                                            ))}
                                            <td>
                                                <button
                                                    className="btn btn-secundario btn-chico"
                                                    onClick={() => verDetalle(mes.mes)}
                                                    disabled={cargandoDetalle || mes.total === 0}
                                                >
                                                    Ver detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>Total {resumen.anio}</td>
                                        <td>{resumen.totalAnual.salidas}</td>
                                        <td>{resumen.totalAnual.actividades}</td>
                                        <td>{resumen.totalAnual.total}</td>
                                        {METROLOGOS.map((m) => (
                                            <td key={m}>{totalAnualMetrologo(m)}</td>
                                        ))}
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </>
                )}

                {cargandoDetalle && <p className="mensaje-cargando">Cargando detalle...</p>}

                {detalle && !cargandoDetalle && (
                    <section className="detalle-mes">
                        <div className="detalle-mes-encabezado">
                            <h2>
                                {detalle.nombreMes} {detalle.anio}
                            </h2>
                            <button className="btn btn-secundario btn-chico" onClick={() => setDetalle(null)}>
                                Cerrar detalle
                            </button>
                        </div>

                        <TablaRegistros titulo="Salidas de metrólogos" registros={detalle.salidas} />
                        <TablaRegistros titulo="Actividades del laboratorio" registros={detalle.actividades} />
                    </section>
                )}
            </main>
        </>
    )
}

export default Historial