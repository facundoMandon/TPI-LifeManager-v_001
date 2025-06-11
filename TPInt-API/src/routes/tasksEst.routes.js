// src/routes/tasksEst.routes.js
import { Router } from "express";
import {
  getTasksEst,
  getTaskEst,
  createTaskEst,
  updateTaskEst,
  deleteTaskEst,
} from "../controllers/tasksEst.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

// ¡IMPORTANTE! Usar { mergeParams: true } para acceder a parámetros de rutas parentales
const router = Router({ mergeParams: true });

// Definimos las rutas para las tareas de estudio
// Estas rutas ahora podrán acceder a 'sectionId' desde req.params
// cuando sean montadas bajo una ruta que contenga ese parámetro.
router.get("/",verifyToken, getTasksEst);         // GET /estudios/:sectionId/tasksEst
router.get("/:id",verifyToken, getTaskEst);       // GET /estudios/:sectionId/tasksEst/:id
router.post("/",verifyToken, createTaskEst);      // POST /estudios/:sectionId/tasksEst
router.put("/:id",verifyToken, updateTaskEst);    // PUT /estudios/:sectionId/tasksEst/:id
router.delete("/:id",verifyToken, deleteTaskEst); // DELETE /estudios/:sectionId/tasksEst/:id

export default router;
