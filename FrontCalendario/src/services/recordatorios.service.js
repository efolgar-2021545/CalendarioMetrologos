import { calendarioApi } from '../api/axios.js'

export const ejecutarRecordatorios = async () => {
    const { data } = await calendarioApi.post('/recordatorios/ejecutar')
    return data.resultado
}