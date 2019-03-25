const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
//pending - finished - paid

let estadosValidos = {
    values: ['PENDING', 'FINISHED', 'PAID'],
    message: '{VALUE} no es un estado válido'
};

let ticketSchema = new Schema({
    estado: { type: String, required: [true, 'El estado es necesario'], default: 'PENDING', enum: estadosValidos },
    valor: { type: Number, required: [true, 'El	valor es necesario'] },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio',
        required: [true, 'El tipo de servicio es obligatorio ']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'tickets' });

ticketSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Ticket', ticketSchema);