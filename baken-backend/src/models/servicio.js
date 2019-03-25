const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let servicioSchema = new Schema({
    tipoServicio: { type: String, required: [true, 'El tipo de servicio	es necesario'] },
    valorUf: { type: Number, required: [true, 'El	valor en UF es necesario'] },
    valorPesos: { type: Number, required: [true, 'El	valor en Pesos es necesario'] },
    fecha: { type: Date, required: [true, 'La fecha es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

servicioSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Servicio', servicioSchema);