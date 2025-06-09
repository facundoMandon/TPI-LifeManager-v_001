import { Router } from "express";
import {
  getTaskById,
  getTasks,
  updateTask,
  createTask,
    deleteTask,
} from "../controllers/tasksEst.controller.js";

const router = Router({ mergeParams: true });


router.get("/", getTasks); // Obtiene todas las tareas
router.get("/:id", getTaskById); // Obtiene una tarea por su ID
router.post("/", createTask); // Crea una nueva tarea
router.put("/:id", updateTask); // Actualiza una tarea existente por su ID
router.delete("/:id", deleteTask); // Elimina una tarea por su ID

export default router;
