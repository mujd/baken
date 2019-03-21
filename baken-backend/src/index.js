/* require('dotenv').config(); */
require('dotenv/config');
require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

// Inicializar variables
const app = express();

// Parse application/json
app.use(express.json());

// Configuración global de rutas
app.use(require('./routes/index'));

// Archivos estaticos
app.use(express.static(__dirname + '/public'));

// Prueba dotenv
/* app.get('/', (req, res) => {
    res.send(process.env.EXPIRATION_TOKEN);
}) */

// Configuración mongo
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('BD: \x1b[32m%s\x1b[0m', 'online');
});

// Configuración puerto
app.listen(process.env.PORT, () => {
    console.log('Server puerto:' + '\x1b[35m ' + process.env.PORT + '\x1b[0m' +
        '\x1b[32m', 'online', '\x1b[0m');
});