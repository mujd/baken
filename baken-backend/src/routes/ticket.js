const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();

let Ticket = require('../models/ticket');


// ============================
// Mostrar todas las tickets
// ============================
app.get('/ticket', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Ticket.find({}, 'estado servicio valor fechaCreacion usuario')
        .sort('valor')
        .skip(desde)
        .limit(limite)
        .populate('servicio', 'tipoServicio valorUf valorPesos fecha')
        .populate('usuario', 'nombre email role')
        .exec((err, tickets) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando tickets',
                    error: err
                });
            }

            Ticket.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    tickets,
                    total: conteo
                });
            });

        });
});

// ============================
// Mostrar todas los tickets pending
// ============================
app.get('/ticket/pending', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Ticket.find({}, 'estado servicio valor fechaCreacion usuario')
        .sort('valor')
        .skip(desde)
        .limit(limite)
        .populate('servicio', 'tipoServicio valorUf valorPesos fecha')
        .populate('usuario', 'nombre email')
        .exec((err, tickets) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando tickets',
                    error: err
                });
            }

            Ticket.count({ estado: 'PENDING' }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    tickets,
                    total: conteo
                });
            });

        });
});
// ============================
// Mostrar todas los tickets finished
// ============================
app.get('/ticket/finished', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Ticket.find({}, 'estado servicio valor fechaCreacion usuario')
        .sort('valor')
        .skip(desde)
        .limit(limite)
        .populate('servicio', 'tipoServicio valorUf valorPesos fecha')
        .populate('usuario', 'nombre email')
        .exec((err, tickets) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando tickets',
                    error: err
                });
            }

            Ticket.count({ estado: 'FINISHED' }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    tickets,
                    total: conteo
                });
            });

        });
});
// ============================
// Mostrar todas los tickets paid
// ============================
app.get('/ticket/paid', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Ticket.find({}, 'estado servicio valor fechaCreacion usuario')
        .sort('valor')
        .skip(desde)
        .limit(limite)
        .populate('servicio', 'tipoServicio valorUf valorPesos fecha')
        .populate('usuario', 'nombre email')
        .exec((err, tickets) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando tickets',
                    error: err
                });
            }

            Ticket.count({ estado: 'PAID' }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    tickets,
                    total: conteo
                });
            });

        });
});

// ============================
// Mostrar una ticket por ID
// ============================
app.get('/ticket/:id', (req, res) => {
    //Ticket.findById();
    let id = req.params.id;
    Ticket.findById(id, 'estado servicio valor fechaCreacion usuario')
        .populate('servicio', 'tipoServicio valorUf valorPesos fecha')
        .populate('usuario', 'nombre email')
        .exec((err, ticketDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar ticket',
                    errors: err
                });
            }
            if (!ticketDB) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La ticket con el id ' + id + ' no existe',
                    errors: { message: 'No existe una ticket con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                ticket: ticketDB
            });
        });
});

// ============================
// Crear nueva ticket
// ============================
app.post('/ticket', verificaToken, (req, res) => {
    // regresa la nueva ticket
    // req.usuario._id
    let body = req.body; //Obtener el body

    let ticket = new Ticket({
        estado: body.estado,
        servicio: body.servicio,
        valor: body.valor,
        fechaCreacion: body.fechaCreacion,
        usuario: req.usuario._id // Con middleware verificaToken se puede obtener el id del usuario
    });

    ticket.save((err, ticketDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear ticket',
                errors: err
            });
        }
        if (!ticketDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear ticket',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            ticket: ticketDB
        });
    });
});

// ============================
// Actualizar ticket
// ============================
app.put('/ticket/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let bodyTicket = _.pick(req.body, ['estado', 'servicio', 'valor', 'fechaCreacion', 'usuario']);
    Ticket.findByIdAndUpdate(id, bodyTicket, { new: true, runValidators: true }, (err, ticketDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar ticket',
                errors: err
            });
        }
        if (!ticketDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La ticket con el id ' + id + ' no existe',
                errors: { message: 'No existe una ticket con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            ticket: ticketDB
        });
    });
});

// ==================================================
// Cambia valor a un ticket 
// ==================================================
app.put('/ticket/cambia-valor/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['valor']);
    Ticket.findByIdAndUpdate(id, body, { new: true }, (err, ticketBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar valor al ticket',
                error: err
            });
        }
        if (!ticketBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                error: { message: 'No existe un usuario con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            ticket: ticketBorrado
        });
    });
});

// ==================================================
// Cambia estado a un ticket 
// ==================================================
app.put('/ticket/estado/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = { estado: 'PENDING' };
    let body = _.pick(req.body, ['estado']);
    Ticket.findByIdAndUpdate(id, body, { new: true }, (err, ticketBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cambiar estado al ticket',
                error: err
            });
        }
        if (!ticketBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                error: { message: 'No existe un usuario con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            ticket: ticketBorrado
        });
    });
});

// ==================================================
// Asignar usuario a un ticket 
// ==================================================
app.put('/ticket/asignar/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['usuario']);
    Ticket.findByIdAndUpdate(id, body, { new: true }, (err, ticketBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al asignar usuario al ticket',
                error: err
            });
        }
        if (!ticketBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                error: { message: 'No existe un usuario con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            ticket: ticketBorrado
        });
    });
});


// ============================
// Borrar tickets
// ============================
app.delete('/ticket/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Ticket.findByIdAndRemove(id, (err, ticketBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar ticket',
                errors: err
            });
        }
        if (!ticketBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La ticket con el id ' + id + ' no existe',
                errors: { message: 'No existe una ticket con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Ticket Borrado'
        });
    });
});

module.exports = app;