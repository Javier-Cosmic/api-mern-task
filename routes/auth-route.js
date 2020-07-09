const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth-controller');

// api/auth
router.post('/', 
    [
        check('email', 'Agrega un correo valido.').isEmail(),
        check('password', 'La clave debe ser minimo de 6 caracteres.').isLength({ min: 6 })
    ],
    authController.authUser
)

module.exports = router;