import { calendarioApi } from '../api/axios.js'

export const getResumenAnual = async (anio) => {
    const { data } = await calendarioApi.get('/historial/anual', { params: { anio } })
    return data.resumen
}

export const getDetalleMes = async (anio, mes) => {
    const { data } = await calendarioApi.get('/historial/mes', { params: { anio, mes } })
    return data.detalle
}