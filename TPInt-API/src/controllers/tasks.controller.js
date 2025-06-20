// src/controllers/tasks.controller.js
import { Tasks } from '../models/Tasks.js';
import { Project } from '../models/Projects.js'; 

// Función auxiliar para verificar la propiedad del proyecto
const checkProjectOwnership = async (projectId, userId, userRole) => {
    if (!projectId) return false; // projectId es obligatorio

    const project = await Project.findByPk(projectId);
    if (!project) {
        console.warn(`[Auth Check] Proyecto con ID ${projectId} no encontrado.`);
        return false; // El proyecto no existe
    }

    // Si el usuario es 'admin' o 'superadmin', tiene permisos sobre cualquier proyecto
    if (userRole === 'admin' || userRole === 'superadmin') {
        return true;
    }

    // Si no es admin/superadmin, solo puede acceder a sus propios proyectos
    return project.userId === userId;
};


// Obtener tareas por Project ID
export const getTasksByProjectId = async (req, res) => {
    try {
        console.log('--- Iniciando getTasksByProjectId ---');
        console.log('Usuario autenticado (req.user):', req.user);
        console.log('ID del proyecto solicitado (req.params.projectId):', req.params.projectId);

        const projectId = parseInt(req.params.projectId, 10);
        const project = await Project.findByPk(projectId);
        if (!project) {
            console.warn(`Proyecto con ID ${projectId} no encontrado para obtener sus tareas.`);
            return res.status(404).json({ message: 'Proyecto no encontrado para obtener sus tareas.' });
        }

        const tasks = await Tasks.findAll({
            where: { projectId: projectId }
        });

        console.log(`Tareas encontradas para el proyecto ${projectId}:`, tasks.length);

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas por ID de proyecto:', error);
        res.status(500).send('Error interno del servidor');
    } finally {
        console.log('--- Finalizando getTasksByProjectId ---');
    }
};

// Crear una nueva tarea 
export const createTask = async (req, res) => {
    try {
        console.log("--- Iniciando createTask ---");
        console.log("REQ.BODY COMPLETO:", req.body);
        console.log("Usuario que intenta crear (req.user):", req.user);
        console.log("ID del proyecto desde URL (req.params.projectId):", req.params.projectId);

        const projectId = parseInt(req.params.projectId, 10); // Asegura que sea un número entero (base decimal, por eso el 10)
        const { title, description, initDate, endDate, content, done } = req.body;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.rol;

        // Verificar permisos para crear la tarea en este proyecto 
        const hasPermission = await checkProjectOwnership(projectId, authenticatedUserId, authenticatedUserRole);
        if (!hasPermission) {
            return res.status(403).json({ message: 'No tienes permiso para crear tareas en este proyecto.' });
        }

        if (!title || !description) {
            console.warn('Faltan campos obligatorios (title o description) al crear tarea.');
            return res.status(400).send('Título y descripción son obligatorios.');
        }

        // Verifica si ya existe una tarea con el mismo título en este proyecto
        const existingTask = await Tasks.findOne({
            where: { title, projectId },
        });
        if (existingTask) {
            console.warn(`Tarea con título '${title}' ya existe para el proyecto ${projectId}.`);
            return res.status(400).send('Ya existe una tarea con este título en este proyecto.');
        }

        const newTask = await Tasks.create({
            title,
            description,
            initDate: initDate ? new Date(initDate) : new Date(), // Si no se proporciona, usa la fecha actual
            endDate: endDate ? new Date(endDate) : null,
            done: done !== undefined ? done : false, // Permite que 'done' se establezca si viene en el body
            projectId: projectId, // Vinculo la tarea al ID del proyecto de la URL
            content: content || null,
        });

        console.log("Nueva tarea creada exitosamente:", newTask.toJSON());
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).send('Error interno del servidor al crear la tarea.');
    } finally {
        console.log('--- Finalizando createTask ---');
    }
};

// Obtengo una tarea por su ID
export const getTaskById = async (req, res) => {
    try {
        console.log('--- Iniciando getTaskById ---');
        console.log('Usuario autenticado (req.user):', req.user);
        console.log('ID de la tarea solicitada (req.params.id):', req.params.id);

        const taskId = parseInt(req.params.id, 10);

        const task = await Tasks.findByPk(taskId);
        if (!task) {
            console.warn(`Tarea con ID ${taskId} no encontrada.`);
            return res.status(404).send('Tarea no encontrada.');
        }


        console.log("Tarea encontrada:", task.toJSON());
        res.status(200).json(task);
    } catch (error) {
        console.error('Error al obtener tarea por ID:', error);
        res.status(500).send('Error interno del servidor');
    } finally {
        console.log('--- Finalizando getTaskById ---');
    }
};

// Actualizo una tarea
export const updateTask = async (req, res) => {
    try {
        console.log('--- Iniciando updateTask ---');
        console.log('ID de la tarea a actualizar (req.params.id):', req.params.id);
        console.log('Datos de actualización (req.body):', req.body);
        console.log('Usuario que intenta actualizar (req.user):', req.user);

        const taskId = parseInt(req.params.id, 10);
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.rol;

        const taskToUpdate = await Tasks.findByPk(taskId);

        if (!taskToUpdate) {
            console.warn(`Tarea con ID ${taskId} no encontrada para actualización.`);
            return res.status(404).send('Tarea no encontrada.');
        }

        // Verificar permisos para actualizar la tarea 
        const hasPermission = await checkProjectOwnership(taskToUpdate.projectId, authenticatedUserId, authenticatedUserRole);
        if (!hasPermission) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar esta tarea.' });
        }

        // Si el título se está actualizando, verifica si el nuevo título ya existe en el mismo proyecto
        if (req.body.title && req.body.title.trim() !== taskToUpdate.title) {
            const existingTaskWithNewTitle = await Tasks.findOne({
                where: { title: req.body.title.trim(), projectId: taskToUpdate.projectId }
            });
            if (existingTaskWithNewTitle && existingTaskWithNewTitle.id !== taskId) {
                console.warn(`El nuevo título '${req.body.title.trim()}' ya está en uso por otra tarea en el mismo proyecto.`);
                return res.status(400).send('Ya existe otra tarea con este título en este proyecto.');
            }
        }

        const [updatedRowsCount] = await Tasks.update(
            {
                title: req.body.title !== undefined ? req.body.title.trim() : taskToUpdate.title,
                description: req.body.description !== undefined ? req.body.description.trim() : taskToUpdate.description,
                initDate: req.body.initDate !== undefined ? new Date(req.body.initDate) : taskToUpdate.initDate,
                endDate: req.body.endDate !== undefined ? new Date(req.body.endDate) : taskToUpdate.endDate,
                done: req.body.done !== undefined ? req.body.done : taskToUpdate.done,
                content: req.body.content !== undefined ? req.body.content : taskToUpdate.content,
            },
            { where: { id: taskId } }
        );

        if (updatedRowsCount === 0) {
            console.warn(`La tarea con ID ${taskId} no pudo ser actualizada (0 filas afectadas).`);
            return res.status(200).send('Tarea actualizada sin cambios o no encontrada.');
        }

        const updatedTask = await Tasks.findByPk(taskId);
        console.log('Tarea actualizada exitosamente:', updatedTask.toJSON());
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).send('Error interno del servidor al actualizar la tarea.');
    } finally {
        console.log('--- Finalizando updateTask ---');
    }
};

// Eliminar una tarea 
export const deleteTask = async (req, res) => {
    try {
        console.log('--- Iniciando deleteTask ---');
        console.log('ID de la tarea a eliminar (req.params.id):', req.params.id);
        console.log('Usuario que intenta eliminar (req.user):', req.user);

        const taskId = parseInt(req.params.id, 10);
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.rol;

        const taskToDelete = await Tasks.findByPk(taskId);

        if (!taskToDelete) {
            console.warn(`Tarea con ID ${taskId} no encontrada para eliminación.`);
            return res.status(404).send('Tarea no encontrada.');
        }

        // Verificar permisos para eliminar la tarea
        // Solo superadmin puede eliminar cualquier tarea
        const hasPermission = await checkProjectOwnership(taskToDelete.projectId, authenticatedUserId, authenticatedUserRole);
        if (!hasPermission && authenticatedUserRole !== 'superadmin') {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta tarea.' });
        }


        const deletedRowsCount = await Tasks.destroy({
            where: { id: taskId }
        });

        if (deletedRowsCount === 0) {
            console.warn(`La tarea con ID ${taskId} no pudo ser eliminada (0 filas afectadas).`);
            return res.status(404).send('Tarea no encontrada o ya eliminada.');
        }
        console.log(`Tarea con ID ${taskId} eliminada exitosamente.`);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).send('Error interno del servidor al eliminar la tarea.');
    } finally {
        console.log('--- Finalizando deleteTask ---');
    }
};


// Obtiene TODAS las tareas de los proyectos de un usuario (para el calendario)
export const getTasksByUserId = async (req, res) => {
    try {
        console.log('--- Iniciando getTasksByUserId (para calendario) ---');
        console.log('Usuario autenticado (req.user):', req.user);
        console.log('ID de usuario solicitado en la URL (req.params.userId):', req.params.userId);

        const targetUserId = parseInt(req.params.userId, 10); // ID de usuario del parámetro de URL
        const authenticatedUserId = req.user.id; // ID del usuario autenticado por token
        const authenticatedUserRole = req.user.rol; // Rol del usuario autenticado

        // Lógica de autorización para ver tareas de otros usuarios:
        if (targetUserId !== authenticatedUserId && authenticatedUserRole !== 'admin' && authenticatedUserRole !== 'superadmin') {
            console.warn(`Usuario ${authenticatedUserId} (rol: ${authenticatedUserRole}) intentó acceder a tareas del usuario ${targetUserId} sin permisos.`);
            return res.status(403).json({ message: 'No tienes permiso para ver estas tareas.' });
        }

        const userProjects = await Project.findAll({
            where: { userId: targetUserId }
        });

        const projectIds = userProjects.map(project => project.id);

        if (projectIds.length === 0) {
            console.log(`No se encontraron proyectos para el usuario ${targetUserId}.`);
            return res.status(200).json([]); 
        }

        const tasks = await Tasks.findAll({
            where: { projectId: projectIds } 
        });

        console.log(`Tareas encontradas para el usuario ${targetUserId} (en ${projectIds.length} proyectos):`, tasks.length);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas por User ID para el calendario:', error);
        res.status(500).send('Error interno del servidor al obtener las tareas para el calendario.');
    } finally {
        console.log('--- Finalizando getTasksByUserId ---');
    }
};

