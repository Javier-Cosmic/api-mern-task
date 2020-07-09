const express = require('express');
const { Router } = require('express');
const router = express.Router();
const projectController = require('../controllers/project-controller');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//  --->  api/project

//crear proyecto
router.post('/', 
    auth, 
    [
        check('name', 'El nombre del proyecto es obligatorio.').not().isEmpty()
    ],
    projectController.createProject);

// obtener todos los proyectos
router.get('/', auth, projectController.getAllproject);

// actualizar proyecto x id
router.put('/:id',
    auth,
    [
        check('name', 'El nombre del proyecto es obligatorio.').not().isEmpty()
    ],
    projectController.updateProject);

// eliminar proyecto
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;