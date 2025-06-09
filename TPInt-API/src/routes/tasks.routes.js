import { Router } from "express";
import {
  getTaskById,
  getTasks,
  getTasksByUserId,
  updateTask,
  createTask,
  deleteTask,
} from "../controllers/tasks.controller.js";
import { requireRole } from "../middleware/require.role.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", getTasks, requireRole, verifyToken); // Obtiene todas las tareas
router.get("/:id", getTaskById, verifyToken); // Obtiene una tarea por su ID
router.get("/user/:userId", getTasksByUserId, verifyToken); // Obtiene todas las tareas de un usuario específico
router.post("/", createTask, verifyToken); // Crea una nueva tarea
router.put("/:id", updateTask, verifyToken); // Actualiza una tarea existente por su ID
router.delete("/:id", deleteTask, verifyToken); // Elimina una tarea por su ID

export default router;
