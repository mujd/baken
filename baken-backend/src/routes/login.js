const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();
const { verificaToken } = require('../middlewares/autenticacion');

// ==================================================
// Renueva Token
// ==================================================
app.get('/login/renuevatoken', verificaToken, (req, res) => {
    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas
    return res.status(200).json({
        ok: true,
        token: token
    });
});
// ==================================================
// Autenticación normal
// ==================================================
app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            /* email */
            return res.status(400).json({
                ok: false,
                error: { message: 'Usuario o contraseña incorrectos' },
                mensaje: 'Credenciales incorrectas',
                error: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            /* password */
            return res.status(400).json({
                ok: false,
                err: { message: 'Usuario o contraseña incorrectos' },
                mensaje: 'Credenciales incorrectas',
                error: err
            });
        }
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: 14400 }); // 4 horas
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
                /* menu: obtenerMenu(usuarioDB.role) */
        });
    });
});

function obtenerMenu(ROLE) {
    var menu = [{
            titulo: "Principal",
            icono: "mdi mdi-gauge",
            submenu: [{ titulo: "Dashboard", url: "/dashboard" }]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'fas fa-ticket-alt',
            submenu: [
                /* { titulo: 'Usuarios', url: '/usuarios' }, */
                { titulo: 'Categorias', url: '/categorias' },
                { titulo: 'Productos', url: '/productos' },
            ]
        }
    ];
    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }
    return menu;
}
module.exports = app;