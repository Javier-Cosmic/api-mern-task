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
        await project.save();
        res.json(project);
        
    } catch (error) {
        
        res.status(500).json({ status: 'Error', msg: 'Ha ocurrido un error interno.'})
    }
}

// mostrar los proyectos por el id autenticado
exports.getAllproject = async (req, res) => {
    try {
        const projects = await Project.find({ author: req.user.id }).sort({ date: -1 });
        res.json({projects});

    } catch (error) {
        
        res.status(500).json({status: 'Error', msg: 'Ocurrió un error.'})
    }
}

// actualiza proyecto
exports.updateProject = async (req, res) => {
    
    // revisar si hay errores de validacion
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // extraer la data ingresada del usuario
    const { name } = req.body;
    const newProject = {}

    // si el nombre existe se guarda en el objeto newProject
    if(name) {
        newProject.name = name;
    }

    try {

        // revisar el id enviado por params (url)
        let project = await Project.findById(req.params.id);
        // si el proyecto no existe
        if(!project){
            return res.status(404).json({ status: 'Error', msg: 'Proyecto no encontrado.'})
        }

        //verificar autor del proyecto
        if(project.author.toString() !== req.user.id){
            return res.status(401).json({ status: 'Error', msg: 'No autorizado.'})
        }

        // finalmente actualizar proyecto
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject}, {new: true});

        res.json({ project })
        
    } catch (error) {
      
        res.status(500).json({ status: 'Error', msg: 'Error de servidor, intenta mas tarde.'});
    }
}

exports.deleteProject = async (req, res) => {

    try {
        // revisar el id
        let project = await Project.findById(req.params.id);
        // si el proyecto no existe
        if(!project){
            return res.status(404).json({ status: 'Error', msg: 'Proyecto no encontrado'});
        }

        // verificar el author del proyecto
        if(project.author.toString() !== req.user.id ){
            return res.status(401).json({ status: 'Error', msg: 'No autorizado.'})
        }

        // eliminar proyecto
        await Project.findOneAndRemove({ _id: req.params.id });

        res.json({ status: 'Ok', msg: 'Proyecto eliminado.'});

    } catch (error) {
        
        res.status(500).json({ status: 'Error', msg: 'Error de servidor.'})
    }
}