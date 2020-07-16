const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res) => {

    // si hay errores de validacion
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        // extrar el id del campo project del proyecto
        const {project} = req.body

        // validar si existe un proyecto previo
        const projectExists = await Project.findById( project );
        if (!projectExists) {
            return res.status(400).json({ status: 'Error', msg: 'Proyecto no encontrado.'})
        }

        // revisar si el proyecto pertenece al usuario logueado
        if(projectExists.author.toString() !== req.user.id){
            return res.status(401).json({ status: 'Error', msg: 'No autorizado.'})
        }

        // crear una tarea
        const task = new Task(req.body);
        
        // guardar tarea
        await task.save();
        res.json({task});
        
    } catch (error) {
        
        res.status(500).json({ status: 'Error', msg: 'Hubo un error de servidor.'})
    }
}

exports.getAlltask = async (req, res) => {
    try {
        // extrar el id del campo project del proyecto
        const {project} = req.query

        // validar si existe un proyecto previo x id
        const projectExists = await Project.findById( project );
        if (!projectExists) {
            return res.status(400).json({ status: 'Error', msg: 'Proyecto no encontrado.'})
        }
 
        // revisar si el proyecto pertenece al usuario logueado
        if(projectExists.author.toString() !== req.user.id){
            return res.status(401).json({ status: 'Error', msg: 'No autorizado.'})
        }

        // buscar tareas por proyecto
        const tasks = await Task.find({ project }).sort({ date: -1 });
        res.json({tasks});

        
    } catch (error) {
        
        res.status(500).json({ status: 'Error', msg: 'Ha ocurrido un error de servidor.'})
    }
}

exports.updateTask = async (req, res) => {
    try {
        // extraer los datos del req body
        const {project, name, state} = req.body

        // validar si existe una tarea x id
        let task = await Task.findById(req.params.id);
        // si la tarea no existe
        if (!task) {
            return res.status(404).json({ status: 'Error', msg: 'No existe esa tarea.' });
        }

        // validar si existe un proyecto previo x id
        const projectExists = await Project.findById( project );
        // revisar si el proyecto pertenece al usuario logueado
        if(projectExists.author.toString() !== req.user.id){
            return res.status(401).json({ status: 'Error', msg: 'No autorizado.'});
        }

        // crear el nuevo objeto editado
        const newTask = {};

        newTask.name = name;
        newTask.state = state;

        //guardar tarea
        task = await Task.findOneAndUpdate({ _id: req.params.id}, newTask, { new: true});
        
        res.json({task});

    } catch (error) {
        
        res.status(500).json({ status: 'Error', msg: 'Error de servidor.'})
    }
}

exports.deleteTask = async (req, res) => {
    try {
        // extrar el id del campo project del proyecto
        const {project} = req.query

        // validar si existe una tarea x id
        const task = await Task.findById(req.params.id);
        // si la tarea no existe
        if (!task) {
            return res.status(404).json({ status: 'Error', msg: 'No existe esa tarea.' });
        }
        
        // validar si existe un proyecto previo x id
        const projectExists = await Project.findById( project );
        // revisar si el proyecto pertenece al usuario logueado
        if(projectExists.author.toString() !== req.user.id){
            return res.status(401).json({ status: 'Error', msg: 'No autorizado.'})
        }

        await Task.findOneAndRemove({ _id: req.params.id })
        res.json({ status: 'Ok', msg: 'Tarea eliminada.'});

    } catch (error) {
       
        res.status(500).json({ status: 'Error', msg: 'Ha ocurrido un error de servidor.'})
    }
}