import { Router } from "express";
import { getTaskById, getTasks, getTasksByUserId, updateTask, createTask, deleteTask } from "../controllers/tasks.controller";

const router = Router();

router.get("/tasks", getTasks); // Obtiene todas las tareas
router.get("/tasks/:id", getTaskById); // Obtiene una tarea por su ID
router.get("/tasks/user/:userId", getTasksByUserId); // Obtiene todas las tareas de un usuario específico
router.post("/tasks", createTask); // Crea una nueva tarea
router.put("/tasks/:id", updateTask); // Actualiza una tarea existente por su ID
router.delete("/tasks/:id", deleteTask); // Elimina una tarea por su ID

export default router;