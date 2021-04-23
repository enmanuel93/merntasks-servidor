const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');
const { modelName } = require('../models/Tarea');

//crea una nueva tarea
exports.crearTarea = async (req, res) => {
    //revisar si hay errores
    const errores = validationResult(req)

    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()})
    }

    //extraer el proyecto y comprobar si existe

    const { proyecto } = req.body;

    try {
        
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //creamos la tarea
        const tarea = new Tarea(req.body)
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        
    }
}

//obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        //extraemos el proyecto
        const {proyecto} = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({tareas});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error');
    }
}


exports.actualizarController = async (req, res) => {
    try {
        //extraemos el proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        //si la tarea existe o no
        const tareaExiste = await Tarea.findById(req.params.id);

        if (!tareaExiste) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }   

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //crear un objeto con la nueva informacion
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});

        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error');
    }
}


//elimina una tarea
exports.eliminarController = async (req, res) => {

    try {
        //extraemos el proyecto y comprobar si existe
        const {proyecto} = req.query;

        //si la tarea existe o no
        const tareaExiste = await Tarea.findById(req.params.id);

        if (!tareaExiste) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }   

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Revisar si el proyecto actual pertenece al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No Autorizado'})
        }

        //eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'})
        
    } catch (error) {
        console.log(error);
        return res.status(500).send('Hubo un error');
    }
}