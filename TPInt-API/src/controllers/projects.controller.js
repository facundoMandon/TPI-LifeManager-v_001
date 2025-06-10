// src/controllers/projects.controller.js
import { Project } from '../models/Projects.js';
import { Tasks } from '../models/Tasks.js';

// 1. Obtener todos los proyectos
export const getProjects = async (req, res) => {
    try {
        console.log('--- Iniciando getProjects ---');
        console.log('Usuario autenticado (req.user):', req.user);

        const projects = await Project.findAll();

        console.log(`Proyectos encontrados: ${projects.length}`);
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error al obtener todos los proyectos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener proyectos.' });
    } finally {
        console.log('--- Finalizando getProjects ---');
    }
};

// 2. Obtener un proyecto por su ID
export const getProjectbyId = async (req, res) => {
    try {
        console.log('--- Iniciando getProjectbyId ---');
        console.log('Usuario autenticado (req.user):', req.user);
        console.log('ID del proyecto solicitado (req.params.id):', req.params.id);

        const projectId = parseInt(req.params.id, 10);
        // const authenticatedUserId = req.user.id; // Ya no se usa para la visualización
        // const authenticatedUserRole = req.user.rol; // Ya no se usa para la visualización

        const project = await Project.findByPk(projectId);

        if (!project) {
            console.warn(`Proyecto con ID ${projectId} no encontrado.`);
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        // --- CAMBIO CLAVE AQUÍ: Se eliminó la restricción de rol/propiedad para la visualización ---
        // Antes:
        // if (project.userId !== authenticatedUserId && authenticatedUserRole !== 'admin' && authenticatedUserRole !== 'superadmin') {
        //     console.warn(`Usuario ${authenticatedUserId} (rol: ${authenticatedUserRole}) intentó acceder al proyecto ${projectId} (dueño: ${project.userId}) sin permisos.`);
        //     return res.status(403).json({ message: 'No tienes permiso para ver este proyecto.' });
        // }
        // Ahora: Todos los usuarios autenticados pueden ver cualquier proyecto.

        console.log("Proyecto encontrado:", project.toJSON());
        res.status(200).json(project);
    } catch (error) {
        console.error('Error al obtener proyecto por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el proyecto.' });
    } finally {
        console.log('--- Finalizando getProjectbyId ---');
    }
};

// 3. Crear un nuevo proyecto
export const createProject = async (req, res) => {
    try {
        console.log('--- Iniciando createProject ---');
        console.log('Usuario que intenta crear (req.user):', req.user);
        console.log('Datos del proyecto a crear (req.body):', req.body);

        const { name, initDate, endDate, state, priority, description } = req.body;
        const userId = req.user.id; // Asocia el proyecto al usuario autenticado

        if (!name || !initDate || !state) {
            console.warn('Faltan campos obligatorios (name, initDate, state) al crear proyecto.');
            return res.status(400).json({ message: 'Nombre, fecha de inicio y estado son obligatorios.' });
        }

        const newProject = await Project.create({
            name,
            initDate: new Date(initDate),
            endDate: endDate ? new Date(endDate) : null,
            state,
            priority,
            description,
            userId, // Se asigna el ID del usuario
        });

        console.log("Nuevo proyecto creado exitosamente:", newProject.toJSON());
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el proyecto.' });
    } finally {
        console.log('--- Finalizando createProject ---');
    }
};

// 4. Actualizar un proyecto
export const updateProject = async (req, res) => {
    try {
        console.log('--- Iniciando updateProject ---');
        console.log('ID del proyecto a actualizar (req.params.id):', req.params.id);
        console.log('Datos de actualización (req.body):', req.body);
        console.log('Usuario que intenta actualizar (req.user):', req.user);

        const projectId = parseInt(req.params.id, 10);
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.rol;

        const projectToUpdate = await Project.findByPk(projectId);

        if (!projectToUpdate) {
            console.warn(`Proyecto con ID ${projectId} no encontrado para actualización.`);
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        // Lógica de autorización para actualizar (se mantiene restringida):
        if (projectToUpdate.userId !== authenticatedUserId && authenticatedUserRole !== 'admin' && authenticatedUserRole !== 'superadmin') {
            console.warn(`Usuario ${authenticatedUserId} (rol: ${authenticatedUserRole}) intentó actualizar el proyecto ${projectId} (dueño: ${projectToUpdate.userId}) sin permisos.`);
            return res.status(403).json({ message: 'No tienes permiso para actualizar este proyecto.' });
        }

        const [updatedRowsCount] = await Project.update(req.body, {
            where: { id: projectId }
        });

        if (updatedRowsCount === 0) {
            console.warn(`El proyecto con ID ${projectId} no pudo ser actualizado (0 filas afectadas).`);
            return res.status(200).json({ message: 'Proyecto actualizado sin cambios o no encontrado.' });
        }

        const updatedProject = await Project.findByPk(projectId);
        console.log('Proyecto actualizado exitosamente:', updatedProject.toJSON());
        res.status(200).json(updatedProject);
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el proyecto.' });
    } finally {
        console.log('--- Finalizando updateProject ---');
    }
};

// 5. Eliminar un proyecto
export const deleteProject = async (req, res) => {
    try {
        console.log('--- Iniciando deleteProject ---');
        console.log('ID del proyecto a eliminar (req.params.id):', req.params.id);
        console.log('Usuario que intenta eliminar (req.user):', req.user);

        const projectId = parseInt(req.params.id, 10);
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.rol;

        const projectToDelete = await Project.findByPk(projectId);

        if (!projectToDelete) {
            console.warn(`Proyecto con ID ${projectId} no encontrado para eliminación.`);
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        // Lógica de autorización para eliminar (se mantiene restringida):
        if (authenticatedUserRole !== 'superadmin' && projectToDelete.userId !== authenticatedUserId) {
            console.warn(`Usuario ${authenticatedUserId} (rol: ${authenticatedUserRole}) intentó eliminar el proyecto ${projectId} (dueño: ${projectToDelete.userId}) sin permisos de superadmin o propiedad.`);
            return res.status(403).json({ message: 'No tienes permiso para eliminar este proyecto.' });
        }

        const deletedRowsCount = await Project.destroy({
            where: { id: projectId }
        });

        if (deletedRowsCount === 0) {
            console.warn(`El proyecto con ID ${projectId} no pudo ser eliminado (0 filas afectadas).`);
            return res.status(404).json({ message: 'Proyecto no encontrado o ya eliminado.' });
        }
        console.log(`Proyecto con ID ${projectId} eliminado exitosamente.`);
        res.sendStatus(204);
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el proyecto.' });
    } finally {
        console.log('--- Finalizando deleteProject ---');
    }
};

// 6. Obtener proyectos por User ID
export const getProjectsByUserId = async (req, res) => {
    try {
        console.log('--- Iniciando getProjectsByUserId ---');
        console.log('Usuario autenticado (req.user):', req.user);
        console.log('ID de usuario solicitado (req.params.userId):', req.params.userId);

        const targetUserId = parseInt(req.params.userId, 10);
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.rol;

        // Autorización: un usuario solo puede ver sus propios proyectos, a menos que sea admin/superadmin
        if (targetUserId !== authenticatedUserId && authenticatedUserRole !== 'admin' && authenticatedUserRole !== 'superadmin') {
            console.warn(`Usuario ${authenticatedUserId} (rol: ${authenticatedUserRole}) intentó acceder a proyectos del usuario ${targetUserId} sin permisos.`);
            return res.status(403).json({ message: 'No tienes permiso para ver estos proyectos.' });
        }

        const projects = await Project.findAll({
            where: { userId: targetUserId }
        });

        console.log(`Proyectos encontrados para el usuario ${targetUserId}: ${projects.length}`);
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error al obtener proyectos por User ID:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    } finally {
        console.log('--- Finalizando getProjectsByUserId ---');
    }
};
