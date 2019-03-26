const express = require('express');
let app = express();
let Servicio = require('../models/servicio');
let Ticket = require('../models/ticket');
let Usuario = require('../models/usuario');


// ==================================================
// Busqueda por colección
// ==================================================
app.get('/busqueda/coleccion/:tabla/:busqueda', (req, res) => {
    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    let regex = new RegExp(busqueda, 'i');

    let promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'tickets':
            promesa = buscarTickets(busqueda, regex);
            break;
        case 'servicios':
            promesa = buscarServicios(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, tickets y servicios',
                error: { message: 'Tipo de tabla/colección no válido' }
            });

    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// ==================================================
// Busqueda general
// ==================================================
app.get('/busqueda/todo/:busqueda', (req, res, next) => {

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarServicios(busqueda, regex),
            buscarTickets(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                servicios: respuestas[0],
                tickets: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarServicios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Servicio.find({ tipoServicio: regex })
            .populate('usuario', 'nombre email')
            .exec((err, servicios) => {
                if (err) {
                    reject('Error al cargar servicios', err);
                } else {
                    resolve(servicios);
                }
            });
    });
}

function buscarTickets(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Ticket.find({ estado: regex })
            .populate('servicio', 'tipoServicio valorUf')
            .populate('usuario', 'nombre email')
            .exec((err, tickets) => {

                if (err) {
                    reject('Error al cargar tickets', err);
                } else {
                    resolve(tickets);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;