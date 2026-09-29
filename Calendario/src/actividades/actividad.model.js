import { Schema, model } from 'mongoose'

const actividadSchema = new Schema({
    fecha: {
        type: Date,
        required: [true, 'La fecha de la actividad es obligatoria']
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

export default model('Actividad', actividadSchema)