const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ==================================================
// Verificar Token
// ==================================================
let verificaTokens = (req, res, next) => {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
//======================
// Verificar Token
//======================
let verificaToken = (req, res, next) => {
    // Token o Authorization
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                error: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

//======================
// Verificar AdminRole
//======================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador',
            error: {
                message: 'El usuario no es administrador'
            }
        });
    }
};
// ==================================================
// Verificar ADMIN o Mismo Usuario
// ==================================================
let verificaADMIN_o_MismoUsuario = (req, res, next) => {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        /* console.log(usuario.role); */
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador ni es el mismo usuario',
            errors: { message: 'No es administrador, no puede hacer eso' }
        });
    }
};
module.exports = { verificaToken, verificaAdmin_Role, verificaADMIN_o_MismoUsuario }