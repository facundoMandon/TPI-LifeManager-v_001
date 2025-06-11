// src/controllers/tasksEst.controller.js
import { TasksEst } from "../models/TasksEst.js"; // Importamos el modelo de TasksEst

// Helper para verificar la autenticación
const checkAuthentication = (req, res) => {
  // El middleware `verifyToken` ya ha adjuntado la información del usuario a `req.user`.
  // Si `req.user` no existe o no tiene un `id`, significa que el token no era válido
  // o el middleware no lo procesó correctamente, y ya debería haber sido bloqueado por `verifyToken`.
  // Esta es una verificación redundante pero segura en el controlador.
  if (!req.user || !req.user.id) {
    console.warn("Acceso denegado: Usuario no autenticado o ID de usuario no disponible en req.user.");
    // Aunque verifyToken ya envía 401/403, esto es un fallback
    return res.status(401).json({ message: "No autenticado. Por favor, inicia sesión." });
  }
  // console.log("Usuario autenticado en TasksEst controller:", req.user); // Para depuración
  return null; // Retorna null si la autenticación es exitosa
};

// Obtener todas las tareas de estudio para una sección específica
export const getTasksEst = async (req, res) => {
  try {
    const authError = checkAuthentication(req, res);
    if (authError) return authError; // Si no autenticado, termina aquí

    const { sectionId } = req.params;

    // Buscamos todas las tareas que pertenezcan a este sectionId
    const tasksEst = await TasksEst.findAll({
      where: {
        sectionId: sectionId,
      },
    });

    res.json(tasksEst);
  } catch (error) {
    console.error("Error al obtener tareas de estudio:", error);
    res.status(500).json({ message: "Error interno del servidor al obtener tareas de estudio." });
  }
};

// Obtener una sola tarea de estudio por su ID
export const getTaskEst = async (req, res) => {
  try {
    const authError = checkAuthentication(req, res);
    if (authError) return authError; // Si no autenticado, termina aquí

    const { id } = req.params;
    const taskEst = await TasksEst.findByPk(id);

    if (!taskEst) {
      return res.status(404).json({ message: "Tarea de estudio no encontrada." });
    }

    res.json(taskEst);
  } catch (error) {
    console.error("Error al obtener tarea de estudio:", error);
    res.status(500).json({ message: "Error interno del servidor al obtener tarea de estudio." });
  }
};

// Crear una nueva tarea de estudio
export const createTaskEst = async (req, res) => {
  try {
    const authError = checkAuthentication(req, res);
    if (authError) return authError; // Si no autenticado, termina aquí

    const { sectionId } = req.params;
    const { title, description, initDate, endDate, done, content } = req.body;

    // Puedes añadir una verificación extra si sectionId es null/undefined aquí,
    // aunque `mergeParams: true` y la ruta deben asegurarlo.
    if (!sectionId) {
      console.warn("Falta sectionId en createTaskEst.");
      return res.status(400).json({ message: "ID de sección es requerido." });
    }
    if (!title) {
        console.warn("Falta el título en createTaskEst.");
        return res.status(400).json({ message: "El título de la tarea es requerido." });
    }

    const newTaskEst = await TasksEst.create({
      title,
      description,
      initDate,
      endDate,
      done,
      sectionId: sectionId,
      content,
      // No asignamos userId aquí porque las tareas de estudio son generales (no user-specific en el modelo).
      // El autenticación es solo para asegurar que un usuario logeado realiza la acción.
    });

    res.status(201).json(newTaskEst);
  } catch (error) {
    console.error("Error al crear tarea de estudio:", error);
    res.status(500).json({ message: "Error interno del servidor al crear tarea de estudio." });
  }
};

// Actualizar una tarea de estudio existente
export const updateTaskEst = async (req, res) => {
  try {
    const authError = checkAuthentication(req, res);
    if (authError) return authError; // Si no autenticado, termina aquí

    const { id } = req.params;
    const { title, description, initDate, endDate, done, content } = req.body;

    const taskEst = await TasksEst.findByPk(id);

    if (!taskEst) {
      return res.status(404).json({ message: "Tarea de estudio no encontrada para actualizar." });
    }

    taskEst.title = title !== undefined ? title : taskEst.title;
    taskEst.description = description !== undefined ? description : taskEst.description;
    taskEst.initDate = initDate !== undefined ? initDate : taskEst.initDate;
    taskEst.endDate = endDate !== undefined ? endDate : taskEst.endDate;
    taskEst.done = done !== undefined ? done : taskEst.done;
    taskEst.content = content !== undefined ? content : taskEst.content;

    await taskEst.save();

    res.json(taskEst);
  } catch (error) {
    console.error("Error al actualizar tarea de estudio:", error);
    res.status(500).json({ message: "Error interno del servidor al actualizar tarea de estudio." });
  }
};

// Eliminar una tarea de estudio
export const deleteTaskEst = async (req, res) => {
  try {
    const authError = checkAuthentication(req, res);
    if (authError) return authError; // Si no autenticado, termina aquí

    const { id } = req.params;

    const deletedRows = await TasksEst.destroy({
      where: { id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Tarea de estudio no encontrada para eliminar." });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar tarea de estudio:", error);
    res.status(500).json({ message: "Error interno del servidor al eliminar tarea de estudio." });
  }
};
