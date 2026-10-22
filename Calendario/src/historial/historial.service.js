import Salida from '../salidas/salida.model.js'
import Actividad from '../actividades/actividad.model.js'

const NOMBRES_MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

// Rango completo de un año: desde el 1 de enero hasta antes del 1 de enero siguiente
const rangoAnio = (anio) => ({
    desde: new Date(Date.UTC(anio, 0, 1)),
    hasta: new Date(Date.UTC(anio + 1, 0, 1))
})

// Rango completo de un mes
const rangoMes = (anio, mes) => ({
    desde: new Date(Date.UTC(anio, mes - 1, 1)),
    hasta: new Date(Date.UTC(anio, mes, 1))
})

// Cuenta registros agrupados por mes y metrólogo dentro de un rango
const agruparPorMesYMetrologo = (Modelo, desde, hasta) => {
    return Modelo.aggregate([
        { $match: { fecha: { $gte: desde, $lt: hasta } } },
        {
            $group: {
                _id: { mes: { $month: '$fecha' }, metrologo: '$metrologo' },
                total: { $sum: 1 }
            }
        }
    ])
}

export const getResumenAnual = async (anio) => {
    const { desde, hasta } = rangoAnio(anio)

    const [salidas, actividades] = await Promise.all([
        agruparPorMesYMetrologo(Salida, desde, hasta),
        agruparPorMesYMetrologo(Actividad, desde, hasta)
    ])

    // Armamos los 12 meses aunque no tengan registros (quedan en 0)
    const meses = NOMBRES_MESES.map((nombre, i) => ({
        mes: i + 1,
        nombre,
        salidas: 0,
        actividades: 0,
        total: 0,
        porMetrologo: {}
    }))

    const acumular = (registros, campo) => {
        for (const r of registros) {
            const mesData = meses[r._id.mes - 1]
            const metrologo = r._id.metrologo

            mesData[campo] += r.total
            mesData.total += r.total

            if (!mesData.porMetrologo[metrologo]) {
                mesData.porMetrologo[metrologo] = { salidas: 0, actividades: 0 }
            }
            mesData.porMetrologo[metrologo][campo] += r.total
        }
    }

    acumular(salidas, 'salidas')
    acumular(actividades, 'actividades')

    const totalAnual = meses.reduce(
        (acc, m) => ({
            salidas: acc.salidas + m.salidas,
            actividades: acc.actividades + m.actividades,
            total: acc.total + m.total
        }),
        { salidas: 0, actividades: 0, total: 0 }
    )

    return { anio, totalAnual, meses }
}

export const getDetalleMes = async (anio, mes) => {
    const { desde, hasta } = rangoMes(anio, mes)

    const filtro = { fecha: { $gte: desde, $lt: hasta } }

    const [salidas, actividades] = await Promise.all([
        Salida.find(filtro).sort({ fecha: 1, hora: 1 }),
        Actividad.find(filtro).sort({ fecha: 1, hora: 1 })
    ])

    return {
        anio,
        mes,
        nombreMes: NOMBRES_MESES[mes - 1],
        totalSalidas: salidas.length,
        totalActividades: actividades.length,
        salidas,
        actividades
    }
}