import { useState } from 'react'
import { editMetrologo } from '../services/users.service.js'

const EditarMetrologoModal = ({ metrologo, onClose, onGuardado }) => {
    const [email, setEmail] = useState(metrologo.email)
    const [error, setError] = useState('')
    const [guardando, setGuardando] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setGuardando(true)

        try {
            await editMetrologo(metrologo.id, { email: email.trim() })
            onGuardado({ tipo: 'ok', texto: `Correo de ${metrologo.name} actualizado correctamente` })
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'No se pudo guardar. Revisa que el correo no esté en uso por otro usuario.'
            )
        } finally {
            setGuardando(false)
        }
    }

    return (
        <div className="modal-fondo">
            <div className="modal-caja">
                <h2>Editar metrólogo</h2>

                <form className="formulario" onSubmit={handleSubmit}>
                    <div className="campo">
                        <label htmlFor="nombre">Nombre</label>
                        <input id="nombre" type="text" value={metrologo.name} disabled />
                    </div>

                    <div className="campo">
                        <label htmlFor="email-metrologo">Correo (usuario de acceso)</label>
                        <input
                            id="email-metrologo"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <p className="ayuda-texto">
                        Este correo es con el que el metrólogo inicia sesión y también al que
                        le llegan las notificaciones y recordatorios.
                    </p>

                    {error && <p className="mensaje-error">{error}</p>}

                    <div className="modal-acciones">
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

export default EditarMetrologoModal