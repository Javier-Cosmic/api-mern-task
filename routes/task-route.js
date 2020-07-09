const express = require('express');
const router= express.Router();
const taskController = require('../controllers/task-controller');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// ---> api/tasks

//crear tarea
router.post('/',
    auth,    
    [
        check('name', 'El nombre de la tarea es obligatorio.').not().isEmpty(),
        check('project', 'El proyecto es obligatorio.')
        
    ], taskController.createTask);

// mostrar tareas
router.get('/', auth, taskController.getAlltask);

// actualizar tarea
router.put('/:id', auth, taskController.updateTask);

// eliminar tarea
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;