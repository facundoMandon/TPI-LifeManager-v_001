import { Router } from "express";
<<<<<<< HEAD
import { getSections, getAllSectionsByUserId, createSection, updateSection, deleteSection } from "../controllers/sections.controller.js";
import { requireRole } from "../middleware/require.role.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", verifyToken, getSections); // Solo para el administrador
router.get("/user/:userId", verifyToken, getAllSectionsByUserId); // Para el usuario, para ver todas las secciones que le pertenecen
router.post("/", verifyToken, createSection); // Crea una nueva sección
router.put("/:id", verifyToken, updateSection); // Actualiza una sección existente por su ID
router.delete("/:id", verifyToken, requireRole, deleteSection); // Elimina una sección por su ID
=======
import {
  getSections,
  getAllSectionsByUserId,
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/sections.controller.js";

import tasksRouter from "./tasks.routes.js"; // Importo router de tareas

const router = Router();

router.get("/", getSections);
router.get("/user/:userId", getAllSectionsByUserId);
router.post("/", createSection);
router.put("/:id", updateSection);
router.delete("/:id", deleteSection);
>>>>>>> 75f8a88df3559bb996e023b38894dec0910661b6

// Montar el router de tareas como subruta en /:sectionId/tasks
router.use("/:sectionId/tasks", tasksRouter);

export default router;
