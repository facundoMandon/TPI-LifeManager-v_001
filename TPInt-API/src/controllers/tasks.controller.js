import { where } from 'sequelize';
import Tasks from '../models/Tasks.js';

export const getTasks = async (req, res) => {
    try {
        const tasks = await Tasks.findAll();
        console.log("Tasks:", tasks);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
    }

export const createTask = async (req, res) => {
    try {
        console.log("REQ.BODY COMPLETO:", req.body); //Esto es para ver el cuerpo de la solicitud
        const { title, description, initDate, endDate, projectId } = req.body; // guardo el cuerpo de la solicitud en variables
        if (!title || !description || !projectId) { // Verifico que los campos title, description y projectId no sean nulos
            return res.status(400).send('Title, description, and projectId are required');
        }
        // Check if the task already exists
        const existingTask = await Tasks.findOne({ // una vez que tengo los datos, chequeo si ya existe una tarea con el mismo título y projectId
            where: { title, projectId }, //
        });
        if (existingTask) { // si existe, retorno un error 400
            // if toma que si encuentra una tarea con el mismo título y projectId, retorna un error 400. Si bien no es un boolean, javascript lo evalúa como tal.
            return res.status(400).send('Task already exists in this project');
        }
        // Create a new task
        const newTask = await Tasks.create({ // si no existe, creo una nueva tarea
            title,
            description,
            initDate: initDate ? new Date(initDate) : new Date(), // Si initDate no se proporciona, se asigna la fecha actual
            endDate: endDate ? new Date(endDate) : null, // Si endDate no se proporciona, se asigna null
            done: false, // Por defecto, la tarea no está hecha
            projectId,
            content: req.body.content || null // Si content no se proporciona, se asigna null
        })} catch (error) {
        res.status(500).send('Internal Server Error');
        console.error('Error creating task:', error)};}

export const getTaskById = async (req, res) => {
    const { id } = req.params; // Obtengo el id de la tarea desde los parámetros de la solicitud
    try {
        const task = await Tasks.findByPk(id); // Busco la tarea por su id
        if (!task) { // Si no se encuentra la tarea, retorno un error 404
            return res.status(404).send('Task not found');
        }
        res.json(task); // Si se encuentra, retorno la tarea en formato JSON
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params; // Obtengo el id de la tarea desde los parámetros de la solicitud
    try {
        const [updated] = await Tasks.update(req.body, { // Actualizo la tarea con los datos del cuerpo de la solicitud
            where: { id }
        });
        if (!updated) { // Si no se actualizó ninguna tarea, retorno un error 404
            return res.status(404).send('Task not found');
        }
        const updatedTask = await Tasks.findByPk(id); // Busco la tarea actualizada
        res.json(updatedTask); // Retorno la tarea actualizada en formato JSON
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const deleteTask = async (req, res) => {
    const { id } = req.params; // Obtengo el id de la tarea desde los parámetros de la solicitud
    try {
        const deleted = await Tasks.destroy({ // Elimino la tarea por su id
            where: { id }
        });
        if (!deleted) { // Si no se eliminó ninguna tarea, retorno un error 404
            return res.status(404).send('Task not found');
        }
        res.sendStatus(204); // Retorno un estado 204 No Content si la eliminación fue exitosa
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const getTasksByProjectId = async (req, res) => {
    const { projectId } = req.params; // Obtengo el id del proyecto desde los parámetros de la solicitud
    try {
        const tasks = await Tasks.findAll({ // Busco todas las tareas que pertenecen al proyecto con el id proporcionado
            where: { projectId }
        });
        if (tasks.length === 0) { // Si no se encuentran tareas, retorno un mensaje indicando que no hay tareas
            return res.status(404).send('No tasks found for this project');
        }
        res.json(tasks); // Retorno las tareas en formato JSON
    } catch (error) {
        console.error('Error fetching tasks by project ID:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const getTasksByUserId = async (req, res) => {
    const { userId } = req.params; // Obtengo el id del usuario desde los parámetros de la solicitud
    try {
        const tasks = await Tasks.findAll({ // Busco todas las tareas que pertenecen al usuario con el id proporcionado
            where: { userId }
        });
        if (tasks.length === 0) { // Si no se encuentran tareas, retorno un mensaje indicando que no hay tareas
            return res.status(404).send('No tasks found for this user');
        }
        res.json(tasks); // Retorno las tareas en formato JSON
    } catch (error) {
        console.error('Error fetching tasks by user ID:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

