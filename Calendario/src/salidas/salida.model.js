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
    metrologo: {
        type: String,
        required: [true, 'Debes asignar un metrólogo'],
        enum: ['Dilsy', 'Alejandra', 'Manuel', 'Hector']
    },
    hora: {
        type: String, // ej. "09:00", se llena desde un select en el frontend
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
        type: String, // uid del admin que la agendó (viene del token)
        required: true
    }
}, {
    timestamps: true
})

export default model('Salida', salidaSchema)