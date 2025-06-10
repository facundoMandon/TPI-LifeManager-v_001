// src/routes/sections.routes.js
import { Router } from "express";
// Eliminamos getAllSectionsByUserId del import ya que la ruta asociada fue removida
import { getSections, createSection, updateSection, deleteSection } from "../controllers/sections.controller.js";
import { requireRole } from "../middleware/require.role.js";
import { verifyToken } from "../middleware/verifyToken.js";
// tasksRouter no es necesario aquí para las rutas de secciones, pero se mantiene si lo usas en otro lugar
// import tasksRouter from "./tasks.routes.js";

const router = Router();

router.get("/", verifyToken, getSections);
router.post("/", verifyToken, requireRole(['admin', 'superadmin']), createSection);
router.put("/:id", verifyToken, requireRole(['admin', 'superadmin']), updateSection);
router.delete("/:id", verifyToken, requireRole("superadmin"), deleteSection);

export default router;
