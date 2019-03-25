const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();

let Servicio = require('../models/servicio');


// ============================
// Mostrar todos los servicios
// ============================
app.get('/servicio', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Servicio.find({}, 'tipoServicio valorUf valorPesos fecha usuario')
        .sort('valorUf')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email role')
        .exec((err, servicios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando servicios',
                    error: err
                });
            }

            Servicio.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    servicios,
                    total: conteo
                });
            });

        });
});

// ============================
// Mostrar una servicio por ID
// ============================
app.get('/servicio/:id', (req, res) => {
    //Servicio.findById();
    let id = req.params.id;
    Servicio.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, servicioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar servicio',
                    errors: err
                });
            }
            if (!servicioDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La servicio con el id ' + id + ' no existe',
                    errors: { message: 'No existe una servicio con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                servicio: servicioDB
            });
        });
});

// ============================
// Crear nueva servicio
// ============================
app.post('/servicio', verificaToken, (req, res) => {
    // regresa la nueva servicio
    // req.usuario._id
    let body = req.body; //Obtener el body

    let servicio = new Servicio({
        tipoServicio: body.tipoServicio,
        valorUf: body.valorUf,
        valorPesos: parseFloat(body.valorPesos),
        /* valorPesos: body.valorPesos, */
        fecha: body.fecha,
        usuario: req.usuario._id // Con middleware verificaToken se puede obtener el id del usuario
    });

    servicio.save((err, servicioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear servicio',
                errors: err
            });
        }
        if (!servicioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear servicio',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            servicio: servicioDB
        });
    });
});

// ============================
// Actualizar servicio
// ============================
app.put('/servicio/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let bodyServicio = _.pick(req.body, ['tipoServicio', 'valorUf', 'valorPesos', 'valorFecha']);
    Servicio.findByIdAndUpdate(id, bodyServicio, { new: true, runValidators: true }, (err, servicioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar servicio',
                errors: err
            });
        }
        if (!servicioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La servicio con el id ' + id + ' no existe',
                errors: { message: 'No existe una servicio con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            servicio: servicioDB
        });
    });
});


// ============================
// Borrar servicios
// ============================
app.delete('/servicio/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // solo un administrador puede borrar servicios
    // Servicio.findByIdAndRemove
    let id = req.params.id;

    Servicio.findByIdAndRemove(id, (err, servicioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar servicio',
                errors: err
            });
        }
        if (!servicioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La servicio con el id ' + id + ' no existe',
                errors: { message: 'No existe una servicio con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Servicio Borrado'
        });
    });
});

module.exports = app;