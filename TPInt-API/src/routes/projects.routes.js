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

router.get("/", verifyToken, requireRole('admin'), getProjects); // Ruta para obtener todos los proyectos, solo accesible por admin
router.get("/:id", verifyToken, getProjectbyId);
router.get("/user/:userId", verifyToken, getProjectsByUserId);
router.post("/", verifyToken, requireRole('admin'), createProject ); // Ruta para crear un proyecto, solo accesible por admin
router.put("/:id", verifyToken, updateProject);
router.delete("/:id", verifyToken, requireRole('admin'), deleteProject); // Ruta para eliminar un proyecto, solo accesible por admin


export default router;
