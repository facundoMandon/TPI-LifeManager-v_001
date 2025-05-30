import { Router } from "express";
import { getSections, getAllSectionsByUserId, createSection, updateSection, deleteSection } from "../controllers/sections.controller";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/sections", verifyToken, getSections); // Solo para el administrador
router.get("/sections/user/:userId", verifyToken, getAllSectionsByUserId); // Para el usuario, para ver todas las secciones que le pertenecen
router.post("/sections", verifyToken, createSection); // Crea una nueva sección
router.put("/sections/:id", verifyToken, updateSection); // Actualiza una sección existente por su ID
router.delete("/sections/:id", verifyToken, deleteSection); // Elimina una sección por su ID

export default router;