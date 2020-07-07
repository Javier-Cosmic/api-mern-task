const Project = require('../models/Project');
const { validationResult } = require('express-validator');


exports.createProject = async (req, res) => {

    // si hay errores de validacion
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // crear nuevo proyecto
        const project = new Project(req.body);

        // guardar el autor  --> rescatamos el id del middleware del token enviado por request
        project.author = req.user.id;

        // guardar el proyecto
        project.save();
        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Error', msg: 'Ha ocurrido un error interno.'})
    }
}

// mostrar los proyectos por el id autenticado
exports.getAllproject = async (req, res) => {
    try {
        const project = await Project.find({ author: req.user.id }).sort({ date: -1 });
        res.json({project});

    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'Error', msg: 'Ocurrió un error.'})
    }
}