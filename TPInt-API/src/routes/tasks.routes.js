// src/routes/tasks.routes.js
import { Router } from "express";
import {
  getTaskById,
  getTasksByProjectId, // Nueva importación para la ruta por proyecto
  getTasksByUserId,
  updateTask,
  createTask,
  deleteTask,
} from "../controllers/tasks.controller.js";
import { requireRole } from "../middleware/require.role.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/:id", verifyToken, getTaskById);
router.get("/project/:projectId", verifyToken, getTasksByProjectId);
router.get("/user/:userId", verifyToken, getTasksByUserId);
router.post("/:projectId", verifyToken, createTask);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, requireRole(["superadmin", "admin"]), deleteTask);

export default router;
