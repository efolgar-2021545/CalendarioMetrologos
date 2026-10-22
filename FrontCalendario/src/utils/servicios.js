import * as salidasService from '../services/salidas.service.js'
import * as actividadesService from '../services/actividades.service.js'
import * as notificacionesService from '../services/notificaciones.service.js'

export const SERVICIOS = {
    salidas: {
        nombre: 'salida',
        crear: salidasService.createSalida,
        actualizar: salidasService.updateSalida,
        eliminar: salidasService.deleteSalida,
        notificar: notificacionesService.notificarSalida
    },
    actividades: {
        nombre: 'actividad',
        crear: actividadesService.createActividad,
        actualizar: actividadesService.updateActividad,
        eliminar: actividadesService.deleteActividad,
        notificar: notificacionesService.notificarActividad
    }
}