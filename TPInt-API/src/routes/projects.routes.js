import { Router } from "express";
import {
  getProjects,
  createProject,
  getProjectbyId,
  updateProject,
  deleteProject,
  getProjectsByUserId,
} from "../controllers/projects.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireRole } from "../middleware/require.role.js";
const router = Router();

router.get("/", getProjects, verifyToken, requireRole("admin")); // Ruta para obtener todos los proyectos, solo accesible por admin
router.get("/:id", getProjectbyId, verifyToken);
router.get("/user/:userId", getProjectsByUserId, verifyToken);
router.post("/", createProject, verifyToken, requireRole("admin")); // Ruta para crear un proyecto, solo accesible por admin
router.put("/:id", updateProject, verifyToken);
router.delete("/:id", deleteProject, verifyToken, requireRole("admin")); // Ruta para eliminar un proyecto, solo accesible por admin


export default router;
