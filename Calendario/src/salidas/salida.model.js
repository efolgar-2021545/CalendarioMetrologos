import { Schema, model } from 'mongoose'

const salidaSchema = new Schema({
    fecha: {
        type: Date,
        required: [true, 'La fecha de la salida es obligatoria']
    },
    cliente: {
        type: String,
        required: [true, 'El cliente es obligatorio']
    },
    metrologoId: {
        type: String, // id del usuario en AuthCalendario
        required: [true, 'Debes asignar un metrólogo']
    },
    metrologo: {
        type: String, // nombre del usuario al momento de agendar
        required: [true, 'Debes asignar un metrólogo']
    },
    hora: {
        type: String,
        required: [true, 'La hora es obligatoria']
    },
    ois: {
        type: String,
        required: [true, 'El OIS es obligatorio']
    },
    observaciones: {
        type: String,
        default: ''
    },
    notificacionEnviada: {
        type: Boolean,
        default: false
    },
    creadoPor: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default model('Salida', salidaSchema)