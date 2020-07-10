const express = require('express');
const router = express.Router();
const userController = require('../controllers/users-controller');
const {check} = require('express-validator');
const auth = require('../middleware/auth');

// api/user    --> end point por post (enviar usuario)
router.post('/',
    [ //validacion de los campos del modelo
        check('names', 'El nombre es obligatorio.').not().isEmpty(),
        check('email', 'Agrega un correo valido.').isEmail(),
        check('password', 'La clave debe ser minimo de 6 caracteres.').isLength({ min: 6 })
    ], userController.createUser);

module.exports = router;