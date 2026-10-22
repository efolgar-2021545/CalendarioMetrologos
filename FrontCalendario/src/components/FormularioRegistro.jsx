import { useState } from 'react'
import { METROLOGOS, HORAS } from '../utils/constants.js'
import { SERVICIOS } from '../utils/servicios.js'
import { diaDeRegistro } from '../utils/fechas.js'

const TITULOS = {
    salidas: 'salida de metrólogo',
    actividades: 'actividad del laboratorio'
}

const FormularioRegistro = ({ tipo, registro, fechaInicial, horaInicial, onClose, onGuardado }) => {
    const esEdicion = Boolean(registro)
    const servicio = SERVICIOS[tipo]

    const [form, setForm] = useState({
        fecha: registro ? diaDeRegistro(registro.fecha) : fechaInicial || '',
        hora: registro ? registro.hora : horaInicial || '',
        cliente: registro?.cliente || '',
        metrologo: registro?.metrologo || '',
        ois: registro?.ois || '',
        observaciones: registro?.observaciones || '',
        notificar: 'no'
    })
    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    // Si el registro tiene una hora que no está en la lista (ej. creado por Postman), la incluimos
    const horasDisponibles = HORAS.includes(form.hora) || !form.hora
        ? HORAS
        : [...HORAS, form.hora].sort()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setGuardando(true)

        try {
            const body = {
                fecha: form.fecha,
                hora: form.hora,
                cliente: form.cliente.trim(),
                metrologo: form.metrologo,
                ois: form.ois.trim(),
                observaciones: form.observaciones.trim()
            }

            const guardado = esEdicion
                ? await servicio.actualizar(registro._id, body)
                : await servicio.crear(body)

            let aviso = {
                tipo: 'ok',
                texto: esEdicion ? 'Registro actualizado correctamente' : 'Registro agregado correctamente'
            }

            // Si el Admin eligió notificar, se envía el correo en este momento
            if (form.notificar === 'si') {
                try {
                    await servicio.notificar(guardado._id)
                    aviso.texto += ` y notificación enviada a ${form.metrologo}`
                } catch (err) {
                    aviso = {
                        tipo: 'error',
                        texto:
                            'El registro se guardó, pero no se pudo enviar el correo: ' +
                            (err.response?.data?.message || 'error de conexión')
                    }
                }
            }

            onGuardado(aviso)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'No se pudo guardar. Verifica que el servidor esté encendido.'
            )
        } finally {
            setGuardando(false)
        }
    }

    const handleEliminar = async () => {
        const confirmado = window.confirm('¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer.')
        if (!confirmado) return

        setError('')
        setGuardando(true)

        try {
            await servicio.eliminar(registro._id)
            onGuardado({ tipo: 'ok', texto: 'Registro eliminado correctamente' })
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudo eliminar el registro.')
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="modal-fondo">
            <div className="modal-caja">
                <h2>
                    {esEdicion ? 'Editar' : 'Agregar'} {TITULOS[tipo]}
                </h2>

                <form className="formulario" onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="fecha">Fecha</label>
                        <input
                            id="fecha"
                            name="fecha"
                            type="date"
                            value={form.fecha}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="hora">Hora</label>
                        <select id="hora" name="hora" value={form.hora} onChange={handleChange} required>
                            <option value="">Selecciona una hora</option>
                            {horasDisponibles.map((h) => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                    </div>

                    <div className="campo">
                        <label htmlFor="cliente">Cliente</label>
                        <input
                            id="cliente"
                            name="cliente"
                            type="text"
                            value={form.cliente}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="metrologo">Metrólogo</label>
                        <select
                            id="metrologo"
                            name="metrologo"
                            value={form.metrologo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un metrólogo</option>
                            {METROLOGOS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="campo">
                        <label htmlFor="ois">OIS</label>
                        <input
                            id="ois"
                            name="ois"
                            type="text"
                            value={form.ois}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="observaciones">Observaciones</label>
                        <textarea
                            id="observaciones"
                            name="observaciones"
                            rows="3"
                            value={form.observaciones}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="campo">
                        <label htmlFor="notificar">¿Enviar notificación al metrólogo por correo?</label>
                        <select id="notificar" name="notificar" value={form.notificar} onChange={handleChange}>
                            <option value="no">No</option>
                            <option value="si">Sí, enviar ahora</option>
                        </select>
                    </div>

                    {error && <p className="mensaje-error">{error}</p>}

                    <div className="modal-acciones">
                        {esEdicion && (
                            <button
                                type="button"
                                className="btn btn-peligro"
                                onClick={handleEliminar}
                                disabled={guardando}
                            >
                                Eliminar
                            </button>
                        )}

                        <span className="espaciador" />

                        <button
                            type="button"
                            className="btn btn-secundario"
                            onClick={onClose}
                            disabled={guardando}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primario" disabled={guardando}>
                            {guardando ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormularioRegistro