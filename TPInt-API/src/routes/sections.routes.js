import { Router } from "express";
import { getSections, getAllSectionsByUserId, createSection, updateSection, deleteSection } from "../controllers/sections.controller.js";
import { requireRole } from "../middleware/require.role.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", verifyToken, getSections); // Solo para el administrador
router.get("/user/:userId", verifyToken, getAllSectionsByUserId); // Para el usuario, para ver todas las secciones que le pertenecen
router.post("/", verifyToken, createSection); // Crea una nueva sección
router.put("/:id", verifyToken, updateSection); // Actualiza una sección existente por su ID
router.delete("/:id", verifyToken, requireRole, deleteSection); // Elimina una sección por su ID

export default router;