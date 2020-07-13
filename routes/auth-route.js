const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/auth-controller');

/* Iniciar sesion

api/auth */
router.post('/', authController.authUser);

// obtiene el usuario ya autenticado
router.get('/', auth, authController.userIsAuth);

module.exports = router;