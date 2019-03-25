const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();

// ==================================================
// Obtener todos los usuarios
// ==================================================
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find('nombre email role')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    error: err
                });
            }
            Usuario.count((err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            });
        });
});

// ==================================================
// Crear un nuevo usuario
// ==================================================
app.post('/usuario', function(req, res) {
    /* app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) { */
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        role: body.role,
        password: bcrypt.hashSync(body.password, 10)
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                error: err
            });
        }
        /* usuarioDB.password = null; */
        res.status(201).json({
            ok: true,
            usuario: usuarioDB,
            usuarioToken: req.usuario
        });
    });
});

// ==================================================
// Actualizar un usuario
// ==================================================
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// ==================================================
// Borrar un usuario por el id
// ==================================================
app.delete('/usuario/delete/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;