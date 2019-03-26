const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
//pending - finished - paid

let estadosValidos = {
    values: ['PENDING', 'FINISHED', 'PAID'],
    message: '{VALUE} no es un estado válido'
};

let ticketSchema = new Schema({
    estado: { type: String, required: true, enum: estadosValidos },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
        required: [true, 'El tipo de servicio es obligatorio ']
    },
    valor: { type: Number, required: [true, 'El	valor es necesario'] },
    fechaCreacion: { type: Date, required: [true, 'La fecha es necesaria'] },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'tickets' });

ticketSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Ticket', ticketSchema);