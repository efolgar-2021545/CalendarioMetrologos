import { useState } from 'react'
import { ejecutarRecordatorios } from '../services/recordatorios.service.js'

const RecordatoriosCard = () => {
    const [resultado, setResultado] = useState(null)
    const [error, setError] = useState('')
    const [enviando, setEnviando] = useState(false)

    const handleEnviar = async () => {
        const confirmado = window.confirm(
            'Se enviará un correo de recordatorio a cada metrólogo que tenga una salida o actividad mañana. ¿Continuar?'
        )
        if (!confirmado) return

        setError('')
        setResultado(null)
        setEnviando(true)

        try {
            setResultado(await ejecutarRecordatorios())
        } catch (err) {
            setError(err.response?.data?.message || 'No se pudieron enviar los recordatorios.')
        } finally {
            setEnviando(false)
        }
    }

    return (
        <section className="bloque">
            <h2>Recordatorios</h2>
            <p className="ayuda-texto">
                El sistema envía automáticamente, todos los días a las 7:00 a.m., un correo a cada
                metrólogo con lo que tiene agendado para el día siguiente. También puedes enviarlos
                ahora manualmente.
            </p>

            <button className="btn btn-primario" onClick={handleEnviar} disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar recordatorios de mañana ahora'}
            </button>

            {error && <p className="mensaje-error">{error}</p>}

            {resultado && (
                <div className="mensaje-ok">
                    <p>
                        Fecha revisada: <strong>{resultado.fecha}</strong> · Registros encontrados:{' '}
                        <strong>{resultado.totalEncontrados}</strong> · Correos enviados:{' '}
                        <strong>{resultado.enviados}</strong>
                    </p>

                    {resultado.fallidos.length > 0 && (
                        <ul>
                            {resultado.fallidos.map((f) => (
                                <li key={f.id}>
                                    No se pudo enviar a {f.metrologo}: {f.error}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    )
}

export default RecordatoriosCard