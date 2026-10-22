import { fechaLarga } from '../utils/fechas.js'

const TITULOS = {
    salidas: 'Salida de metrólogo',
    actividades: 'Actividad del laboratorio'
}

const DetalleModal = ({ registro, tipo, onClose }) => {
    if (!registro) return null

    return (
        <div className="modal-fondo" onClick={onClose}>
            <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
                <h2>{TITULOS[tipo]}</h2>

                <dl className="detalle-lista">
                    <dt>Fecha</dt>
                    <dd>{fechaLarga(registro.fecha)}</dd>

                    <dt>Hora</dt>
                    <dd>{registro.hora}</dd>

                    <dt>Cliente</dt>
                    <dd>{registro.cliente}</dd>

                    <dt>Metrólogo</dt>
                    <dd>{registro.metrologo}</dd>

                    <dt>OIS</dt>
                    <dd>{registro.ois}</dd>

                    <dt>Observaciones</dt>
                    <dd>{registro.observaciones || 'Sin observaciones'}</dd>
                </dl>

                <button className="btn btn-primario" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    )
}

export default DetalleModal