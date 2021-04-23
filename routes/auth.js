//Rutas para autenticar usuario

const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

//iniciar sesion


//  /api/usuarios
router.post('/', 
    authController.autenticarUsuario
);

//obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado
)

module.exports = router;