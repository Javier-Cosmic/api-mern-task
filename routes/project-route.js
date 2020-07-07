const express = require('express');
const { Router } = require('express');
const router = express.Router();
const projectController = require('../controllers/project-controller');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// api/project
router.post('/', 
    auth, 
    [
        check('name', 'El nombre es obligatorio.').not().isEmpty()
    ],
    projectController.createProject
);

router.get('/', auth, projectController.getAllproject);

module.exports = router;