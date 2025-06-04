import { Router } from "express";
import {
  getTaskById,
  getTasks,
  getTasksByUserId,
  updateTask,
  createTask,
  deleteTask,
} from "../controllers/tasks.controller.js";

const router = Router();

router.get("/", getTasks); // Obtiene todas las tareas
router.get("/:id", getTaskById); // Obtiene una tarea por su ID
router.get("/user/:userId", getTasksByUserId); // Obtiene todas las tareas de un usuario específico
router.post("/", createTask); // Crea una nueva tarea
router.put("/:id", updateTask); // Actualiza una tarea existente por su ID
router.delete("/:id", deleteTask); // Elimina una tarea por su ID

export default router;
